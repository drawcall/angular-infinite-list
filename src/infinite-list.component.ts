import { Component, Input, Output, EventEmitter, SimpleChange, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { ItemStyle, StyleCache, ItemInfo, RenderedRows } from './infinite-list.interface';
import { SizeAndPositionManager, ItemSize } from './size-and-position-manager';
import { InfinitelistService } from './infinite-list.service';
import { ILEvent } from './il-event';
import { Subject } from 'rxjs/Subject';

import {
  ALIGN_AUTO,
  ALIGN_CENTER,
  ALIGN_END,
  ALIGN_START,
  DIRECTION,
  DIRECTION_VERTICAL,
  DIRECTION_HORIZONTAL,
  SCROLL_CHANGE_REASON,
  SCROLL_CHANGE_OBSERVED,
  SCROLL_CHANGE_REQUESTED,
  positionProp,
  scrollProp,
  sizeProp
} from './constants';


@Component({
  selector: 'infinite-list, infinitelist, [infinitelist]',
  template: `
<div #dom [ngStyle]="warpStyle">
  <div #inner [ngStyle]="innerStyle">
    <ng-content></ng-content>
  </div>
</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class InfinitelistComponent {

  private styleCache: StyleCache = {};
  private sizeAndPositionManager: SizeAndPositionManager;
  private _width: string = '100%';
  private _height: string = '100%';


  @Input() scrollDirection: string = DIRECTION_VERTICAL;
  @Input() scrollToAlignment: string = ALIGN_AUTO;

  @Input() useob: boolean = false;
  @Input() overscanCount: number = 4;
  @Input() itemSize: any;
  @Input() data: any[];

  @Input() debug: boolean = false;

  @Input() unit: string = 'px';
  @Input() width: number | string;
  @Input() height: number | string;

  @Input() scrollOffset: number;
  @Input() scrollToIndex: number;

  @Input() estimatedItemSize: number;
  @Output() update = new EventEmitter<ILEvent | Subject<ILEvent>>();

  @ViewChild('dom', { read: ElementRef }) rootNode: ElementRef;
  @ViewChild('inner', { read: ElementRef }) innerNode: ElementRef;

  get itemCount(): number {
    return this.data ? this.data.length : 0;
  }

  get currentSizeProp(): string {
    return sizeProp[this.scrollDirection];
  }

  get currentScrollProp(): string {
    return scrollProp[this.scrollDirection];
  }

  ob$: Subject<ILEvent> = new Subject<ILEvent>();

  warpStyle: any;
  innerStyle: any;
  offset: number;
  oldOffset: number;
  scrollChangeReason: string;
  items: any[] = [];
  event: ILEvent;
  handleScrollbind: any;

  constructor(private zone: NgZone, private infinitelistService: InfinitelistService) {
    this.event = new ILEvent();
    this.event.getStyle = this.getStyle.bind(this);
  }

  ngOnInit() {
    this.createSizeAndPositionManager();

    this.zone.runOutsideAngular(() => {
      this.handleScrollbind = this.handleScroll.bind(this);
      this.infinitelistService.addEventListener(this.rootNode.nativeElement, 'scroll', this.handleScrollbind);
    });

    // set offset init value
    this.offset = this.scrollOffset || this.scrollToIndex != null && this.getOffsetForIndex(this.scrollToIndex) || 0;
    this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;

    // srcoll init value
    if (this.scrollOffset != null) {
      this.scrollTo(this.scrollOffset);
    } else if (this.scrollToIndex != null) {
      this.scrollTo(this.getOffsetForIndex(this.scrollToIndex));
    }

    if (this.useob) {
      setTimeout(() => {
        this.update.emit(this.ob$);
        this.ngRender();
      }, 0);
    } else {
      this.ngRender();
    }
  }

  ngOnDestroy() {
    this.sizeAndPositionManager.destroy();
    this.infinitelistService.removeEventListener(this.rootNode.nativeElement, 'scroll', this.handleScrollbind);
  }

  ngOnChanges(changes: SimpleChange) {
    this.createSizeAndPositionManager();

    const scrollPropsHaveChanged = (
      this.valueChanged(changes, 'scrollToIndex') ||
      this.valueChanged(changes, 'scrollToAlignment')
    );
    const itemPropsHaveChanged = (
      this.valueChanged(changes, 'data') ||
      this.valueChanged(changes, 'itemSize') ||
      this.valueChanged(changes, 'estimatedItemSize')
    );

    if (this.valueChanged(changes, 'data') ||
      this.valueChanged(changes, 'estimatedItemSize')) {
      this.sizeAndPositionManager.updateConfig({
        itemCount: this.itemCount,
        estimatedItemSize: this.getEstimatedItemSize(),
      });
    }

    if (itemPropsHaveChanged) this.recomputeSizes();

    this.warpStyle = { ...STYLE_WRAPPER, height: this.addUnit(this.height), width: this.addUnit(this.width) };
    this.innerStyle = { ...STYLE_INNER, [this.currentSizeProp]: this.addUnit(this.sizeAndPositionManager.getTotalSize()) };

    if (this.valueChanged(changes, 'scrollOffset')) {
      this.offset = this.scrollOffset || 0;
      this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;
      this.ngRender();
    } else if (typeof this.scrollToIndex === 'number' && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
      this.offset = this.getOffsetForIndex(this.scrollToIndex, this.scrollToAlignment, this.itemCount);
      this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;
      this.ngRender();
    }
  }

  ngDidUpdate() {
    if (this.oldOffset !== this.offset && this.scrollChangeReason === SCROLL_CHANGE_REQUESTED) {
      this.scrollTo(this.offset);
    }
  }

  ngRender() {
    const { start, stop } = this.sizeAndPositionManager.getVisibleRange({
      containerSize: this[this.currentSizeProp] || 0,
      offset: this.offset,
      overscanCount: this.overscanCount
    });

    // fill items;
    if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
      this.items.length = 0;

      for (let i = start; i <= stop; i++) {
        this.items.push(this.data[i]);
      }

      this.event.start = start;
      this.event.stop = stop;
      this.event.offset = this.offset;
      this.event.items = this.items;

      if (!this.infinitelistService.isPureNumber(this.itemSize))
        this.innerStyle = { ...STYLE_INNER, [this.currentSizeProp]: this.addUnit(this.sizeAndPositionManager.getTotalSize()) };

      if (this.useob) {
        this.ob$.next(this.event);

        if (!this.infinitelistService.isPureNumber(this.itemSize))
          this.innerNode.nativeElement.style[this.currentSizeProp] = this.addUnit(this.sizeAndPositionManager.getTotalSize());
      } else {
        this.zone.run(() => this.update.emit(this.event));
      }
    }

    this.ngDidUpdate();
  }

  valueChanged(changes: SimpleChange, key: string) {
    return changes[key] ? changes[key].currentValue !== changes[key].previousValue : false;
  }

  handleScroll(e: UIEvent) {
    const offset = this.getNodeOffset();
    if (offset < 0 || this.offset === offset || e.target !== this.rootNode.nativeElement) return;

    this.offset = offset;
    this.scrollChangeReason = SCROLL_CHANGE_OBSERVED;
    this.ngRender();
  }

  getStyle(index: number): any {
    index += this.event.start;
    const style = this.styleCache[index];
    if (style) return style;

    const { size, offset } = this.sizeAndPositionManager.getSizeAndPositionForIndex(index);
    const debugStyle = this.debug ? { backgroundColor: this.infinitelistService.randomColor() } : null;

    return this.styleCache[index] = {
      ...STYLE_ITEM,
      ...debugStyle,
      [this.currentSizeProp]: this.addUnit(size),
      [positionProp[this.scrollDirection]]: this.addUnit(offset),
    };
  }

  ////////////////////////////////////////////////////////////////////////////
  // PRIVATE
  ////////////////////////////////////////////////////////////////////////////
  // init SizeAndPositionManager
  private createSizeAndPositionManager() {
    if (!this.sizeAndPositionManager)
      this.sizeAndPositionManager = new SizeAndPositionManager({
        itemCount: this.itemCount,
        itemSizeGetter: (index) => this.getSize(index),
        estimatedItemSize: this.getEstimatedItemSize(),
      });

    return this.sizeAndPositionManager;
  }

  private addUnit(val: any): string {
    return typeof val === 'string' ? val : val + this.unit;
  }

  private getEstimatedItemSize() {
    return this.estimatedItemSize || typeof this.itemSize === 'number' && this.itemSize || 50;
  }

  private getNodeOffset() {
    return this.rootNode.nativeElement[this.currentScrollProp];
  }

  private scrollTo(value: number) {
    this.rootNode.nativeElement[this.currentScrollProp] = value;
    this.oldOffset = value;
  }

  private getOffsetForIndex(index: number, scrollToAlignment: string = this.scrollToAlignment, itemCount: number = this.itemCount): number {
    if (index < 0 || index >= itemCount) index = 0;

    return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
      align: this.scrollToAlignment,
      containerSize: this[this.currentSizeProp],
      currentOffset: this.offset || 0,
      targetIndex: index,
    });
  }

  private getSize(index: number): number {
    if (typeof this.itemSize === 'function') {
      return this.itemSize(index);
    }

    return this.infinitelistService.isArray(this.itemSize) ? this.itemSize[index] : this.itemSize;
  }

  private recomputeSizes(startIndex = 0) {
    this.styleCache = {};
    this.sizeAndPositionManager.resetItem(startIndex);
  }
}


const STYLE_WRAPPER: any = {
  overflow: 'auto',
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch',
};

const STYLE_INNER: any = {
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  minHeight: '100%',
};

const STYLE_ITEM: any = {
  position: 'absolute',
  left: 0,
  width: '100%',
  height: '100%'
};
