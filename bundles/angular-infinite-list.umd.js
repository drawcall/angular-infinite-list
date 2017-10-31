(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/platform-browser')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/platform-browser'], factory) :
	(factory((global['angular-infinite-list'] = {}),global.ng.core,global.ng['platform-browser']));
}(this, (function (exports,core,platformBrowser) { 'use strict';

var ILEvent = (function () {
    function ILEvent() {
        this.offset = 0;
        this.start = 0;
        this.stop = 0;
    }
    ILEvent.prototype.getStyle = function (index) { };
    return ILEvent;
}());

var ALIGN_AUTO = 'auto';
var ALIGN_START = 'start';
var ALIGN_CENTER = 'center';
var ALIGN_END = 'end';
var DIRECTION_VERTICAL = 'vertical';
var DIRECTION_HORIZONTAL = 'horizontal';
var SCROLL_CHANGE_OBSERVED = 'observed';
var SCROLL_CHANGE_REQUESTED = 'requested';
var scrollProp = (_a = {},
    _a[DIRECTION_VERTICAL] = 'scrollTop',
    _a[DIRECTION_HORIZONTAL] = 'scrollLeft',
    _a);
var sizeProp = (_b = {},
    _b[DIRECTION_VERTICAL] = 'height',
    _b[DIRECTION_HORIZONTAL] = 'width',
    _b);
var positionProp = (_c = {},
    _c[DIRECTION_VERTICAL] = 'top',
    _c[DIRECTION_HORIZONTAL] = 'left',
    _c);
var _a;
var _b;
var _c;

/* Forked from react-virtualized 💖 */
var SizeAndPositionManager = (function () {
    function SizeAndPositionManager(_a) {
        var itemCount = _a.itemCount, itemSizeGetter = _a.itemSizeGetter, estimatedItemSize = _a.estimatedItemSize;
        this.itemSizeGetter = itemSizeGetter;
        this.itemCount = itemCount;
        this.estimatedItemSize = estimatedItemSize;
        // Cache of size and position data for items, mapped by item index.
        this.itemSizeAndPositionData = {};
        // Measurements for items up to this index can be trusted; items afterward should be estimated.
        this.lastMeasuredIndex = -1;
    }
    SizeAndPositionManager.prototype.updateConfig = function (_a) {
        var itemCount = _a.itemCount, estimatedItemSize = _a.estimatedItemSize;
        this.itemCount = itemCount;
        this.estimatedItemSize = estimatedItemSize;
    };
    SizeAndPositionManager.prototype.getLastMeasuredIndex = function () {
        return this.lastMeasuredIndex;
    };
    /**
     * This method returns the size and position for the item at the specified index.
     * It just-in-time calculates (or used cached values) for items leading up to the index.
     */
    SizeAndPositionManager.prototype.getSizeAndPositionForIndex = function (index) {
        if (index < 0 || index >= this.itemCount) {
            throw Error("Requested index " + index + " is outside of range 0.." + this.itemCount);
        }
        if (index > this.lastMeasuredIndex) {
            var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
            var offset = lastMeasuredSizeAndPosition.offset +
                lastMeasuredSizeAndPosition.size;
            for (var i = this.lastMeasuredIndex + 1; i <= index; i++) {
                var size = this.itemSizeGetter(i);
                if (size == null || isNaN(size)) {
                    throw Error("Invalid size returned for index " + i + " of value " + size);
                }
                this.itemSizeAndPositionData[i] = {
                    offset: offset,
                    size: size,
                };
                offset += size;
            }
            this.lastMeasuredIndex = index;
        }
        return this.itemSizeAndPositionData[index];
    };
    SizeAndPositionManager.prototype.getSizeAndPositionOfLastMeasuredItem = function () {
        return this.lastMeasuredIndex >= 0
            ? this.itemSizeAndPositionData[this.lastMeasuredIndex]
            : { offset: 0, size: 0 };
    };
    /**
     * Total size of all items being measured.
     * This value will be completedly estimated initially.
     * As items as measured the estimate will be updated.
     */
    SizeAndPositionManager.prototype.getTotalSize = function () {
        var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
        return lastMeasuredSizeAndPosition.offset + lastMeasuredSizeAndPosition.size + (this.itemCount - this.lastMeasuredIndex - 1) * this.estimatedItemSize;
    };
    /**
     * Determines a new offset that ensures a certain item is visible, given the alignment.
     *
     * @param align Desired alignment within container; one of "start" (default), "center", or "end"
     * @param containerSize Size (width or height) of the container viewport
     * @return Offset to use to ensure the specified item is visible
     */
    SizeAndPositionManager.prototype.getUpdatedOffsetForIndex = function (_a) {
        var _b = _a.align, align = _b === void 0 ? ALIGN_START : _b, containerSize = _a.containerSize, currentOffset = _a.currentOffset, targetIndex = _a.targetIndex;
        if (containerSize <= 0) {
            return 0;
        }
        var datum = this.getSizeAndPositionForIndex(targetIndex);
        var maxOffset = datum.offset;
        var minOffset = maxOffset - containerSize + datum.size;
        var idealOffset;
        switch (align) {
            case ALIGN_END:
                idealOffset = minOffset;
                break;
            case ALIGN_CENTER:
                idealOffset = maxOffset - (containerSize - datum.size) / 2;
                break;
            case ALIGN_START:
                idealOffset = maxOffset;
                break;
            default:
                idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
        }
        var totalSize = this.getTotalSize();
        return Math.max(0, Math.min(totalSize - containerSize, idealOffset));
    };
    SizeAndPositionManager.prototype.getVisibleRange = function (_a) {
        var containerSize = _a.containerSize, offset = _a.offset, overscanCount = _a.overscanCount;
        var totalSize = this.getTotalSize();
        if (totalSize === 0) {
            return {};
        }
        var maxOffset = offset + containerSize;
        var start = this.findNearestItem(offset);
        if (typeof start === 'undefined') {
            throw Error("Invalid offset " + offset + " specified");
        }
        var datum = this.getSizeAndPositionForIndex(start);
        offset = datum.offset + datum.size;
        var stop = start;
        while (offset < maxOffset && stop < this.itemCount - 1) {
            stop++;
            offset += this.getSizeAndPositionForIndex(stop).size;
        }
        if (overscanCount) {
            start = Math.max(0, start - overscanCount);
            stop = Math.min(stop + overscanCount, this.itemCount - 1);
        }
        return {
            start: start,
            stop: stop,
        };
    };
    /**
     * Clear all cached values for items after the specified index.
     * This method should be called for any item that has changed its size.
     * It will not immediately perform any calculations; they'll be performed the next time getSizeAndPositionForIndex() is called.
     */
    SizeAndPositionManager.prototype.resetItem = function (index) {
        this.lastMeasuredIndex = Math.min(this.lastMeasuredIndex, index - 1);
    };
    /**
     * Searches for the item (index) nearest the specified offset.
     *
     * If no exact match is found the next lowest item index will be returned.
     * This allows partially visible items (with offsets just before/above the fold) to be visible.
     */
    SizeAndPositionManager.prototype.findNearestItem = function (offset) {
        if (isNaN(offset)) {
            throw Error("Invalid offset " + offset + " specified");
        }
        // Our search algorithms find the nearest match at or below the specified offset.
        // So make sure the offset is at least 0 or no match will be found.
        offset = Math.max(0, offset);
        var lastMeasuredSizeAndPosition = this.getSizeAndPositionOfLastMeasuredItem();
        var lastMeasuredIndex = Math.max(0, this.lastMeasuredIndex);
        if (lastMeasuredSizeAndPosition.offset >= offset) {
            // If we've already measured items within this range just use a binary search as it's faster.
            return this.binarySearch({
                high: lastMeasuredIndex,
                low: 0,
                offset: offset,
            });
        }
        else {
            // If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
            // The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
            // The overall complexity for this approach is O(log n).
            return this.exponentialSearch({
                index: lastMeasuredIndex,
                offset: offset,
            });
        }
    };
    SizeAndPositionManager.prototype.binarySearch = function (_a) {
        var low = _a.low, high = _a.high, offset = _a.offset;
        var middle = 0;
        var currentOffset = 0;
        while (low <= high) {
            middle = low + Math.floor((high - low) / 2);
            currentOffset = this.getSizeAndPositionForIndex(middle).offset;
            if (currentOffset === offset) {
                return middle;
            }
            else if (currentOffset < offset) {
                low = middle + 1;
            }
            else if (currentOffset > offset) {
                high = middle - 1;
            }
        }
        if (low > 0) {
            return low - 1;
        }
        return 0;
    };
    SizeAndPositionManager.prototype.exponentialSearch = function (_a) {
        var index = _a.index, offset = _a.offset;
        var interval = 1;
        while (index < this.itemCount &&
            this.getSizeAndPositionForIndex(index).offset < offset) {
            index += interval;
            interval *= 2;
        }
        return this.binarySearch({
            high: Math.min(index, this.itemCount - 1),
            low: Math.floor(index / 2),
            offset: offset,
        });
    };
    return SizeAndPositionManager;
}());

var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var InfinitelistComponent = (function () {
    function InfinitelistComponent() {
        this.styleCache = {};
        this._width = '100%';
        this._height = '100%';
        this.scrollDirection = DIRECTION_VERTICAL;
        this.scrollToAlignment = ALIGN_AUTO;
        this.overscanCount = 4;
        this.debug = false;
        this.unit = 'px';
        this.update = new core.EventEmitter();
        this.items = [];
        this.event = new ILEvent();
        this.event.getStyle = this.getStyle.bind(this);
    }
    
    Object.defineProperty(InfinitelistComponent.prototype, "itemCount", {
        get: function () {
            return this.data ? this.data.length : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InfinitelistComponent.prototype, "currentSizeProp", {
        get: function () {
            return sizeProp[this.scrollDirection];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InfinitelistComponent.prototype, "currentScrollProp", {
        get: function () {
            return scrollProp[this.scrollDirection];
        },
        enumerable: true,
        configurable: true
    });
    InfinitelistComponent.prototype.ngOnInit = function () {
        this.createSizeAndPositionManager();
        // set offset init value
        this.offset = this.scrollOffset || this.scrollToIndex != null && this.getOffsetForIndex(this.scrollToIndex) || 0;
        this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;
        // srcoll init value
        if (this.scrollOffset != null) {
            this.scrollTo(this.scrollOffset);
        }
        else if (this.scrollToIndex != null) {
            this.scrollTo(this.getOffsetForIndex(this.scrollToIndex));
        }
        this.ngRender();
    };
    InfinitelistComponent.prototype.ngOnChanges = function (changes) {
        this.createSizeAndPositionManager();
        var scrollPropsHaveChanged = (this.valueChanged(changes, 'scrollToIndex') ||
            this.valueChanged(changes, 'scrollToAlignment'));
        var itemPropsHaveChanged = (this.valueChanged(changes, 'data') ||
            this.valueChanged(changes, 'itemSize') ||
            this.valueChanged(changes, 'estimatedItemSize'));
        if (this.valueChanged(changes, 'data') ||
            this.valueChanged(changes, 'estimatedItemSize')) {
            this.sizeAndPositionManager.updateConfig({
                itemCount: this.itemCount,
                estimatedItemSize: this.getEstimatedItemSize(),
            });
        }
        if (itemPropsHaveChanged)
            this.recomputeSizes();
        this.warpStyle = __assign({}, STYLE_WRAPPER, { height: this.addUnit(this.height), width: this.addUnit(this.width) });
        this.innerStyle = __assign({}, STYLE_INNER, (_a = {}, _a[this.currentSizeProp] = this.addUnit(this.sizeAndPositionManager.getTotalSize()), _a));
        if (this.valueChanged(changes, 'scrollOffset')) {
            this.offset = this.scrollOffset || 0;
            this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;
            this.ngRender();
        }
        else if (typeof this.scrollToIndex === 'number' && (scrollPropsHaveChanged || itemPropsHaveChanged)) {
            this.offset = this.getOffsetForIndex(this.scrollToIndex, this.scrollToAlignment, this.itemCount);
            this.scrollChangeReason = SCROLL_CHANGE_REQUESTED;
            this.ngRender();
        }
        var _a;
    };
    InfinitelistComponent.prototype.ngDidUpdate = function () {
        if (this.oldOffset !== this.offset && this.scrollChangeReason === SCROLL_CHANGE_REQUESTED) {
            this.scrollTo(this.offset);
        }
    };
    InfinitelistComponent.prototype.ngRender = function () {
        var _a = this.sizeAndPositionManager.getVisibleRange({
            containerSize: this[this.currentSizeProp] || 0,
            offset: this.offset,
            overscanCount: this.overscanCount
        }), start = _a.start, stop = _a.stop;
        // fill items;
        if (typeof start !== 'undefined' && typeof stop !== 'undefined') {
            this.items.length = 0;
            for (var i = start; i <= stop; i++) {
                this.items.push(this.data[i]);
            }
            this.event.start = start;
            this.event.stop = stop;
            this.event.offset = this.offset;
            this.event.items = this.items;
            if (!this.getSizeIsPureNumber())
                this.innerStyle = __assign({}, STYLE_INNER, (_b = {}, _b[this.currentSizeProp] = this.addUnit(this.sizeAndPositionManager.getTotalSize()), _b));
            this.update.emit(this.event);
        }
        this.ngDidUpdate();
        var _b;
    };
    InfinitelistComponent.prototype.valueChanged = function (changes, key) {
        return changes[key] ? changes[key].currentValue !== changes[key].previousValue : false;
    };
    InfinitelistComponent.prototype.handleScroll = function (e) {
        var offset = this.getNodeOffset();
        if (offset < 0 || this.offset === offset || e.target !== this.rootNode.nativeElement)
            return;
        this.offset = offset;
        this.scrollChangeReason = SCROLL_CHANGE_OBSERVED;
        this.ngRender();
    };
    InfinitelistComponent.prototype.getStyle = function (index) {
        index += this.event.start;
        var style = this.styleCache[index];
        if (style)
            return style;
        var _a = this.sizeAndPositionManager.getSizeAndPositionForIndex(index), size = _a.size, offset = _a.offset;
        var debugStyle = this.debug ? { backgroundColor: this.randomColor() } : null;
        return this.styleCache[index] = __assign({}, STYLE_ITEM, debugStyle, (_b = {}, _b[this.currentSizeProp] = this.addUnit(size), _b[positionProp[this.scrollDirection]] = this.addUnit(offset), _b));
        var _b;
    };
    ////////////////////////////////////////////////////////////////////////////
    // PRIVATE
    ////////////////////////////////////////////////////////////////////////////
    // init SizeAndPositionManager
    InfinitelistComponent.prototype.createSizeAndPositionManager = function () {
        var _this = this;
        if (!this.sizeAndPositionManager)
            this.sizeAndPositionManager = new SizeAndPositionManager({
                itemCount: this.itemCount,
                itemSizeGetter: function (index) { return _this.getSize(index); },
                estimatedItemSize: this.getEstimatedItemSize(),
            });
        return this.sizeAndPositionManager;
    };
    InfinitelistComponent.prototype.addUnit = function (val) {
        return typeof val === 'string' ? val : val + this.unit;
    };
    InfinitelistComponent.prototype.getEstimatedItemSize = function () {
        return this.estimatedItemSize || typeof this.itemSize === 'number' && this.itemSize || 50;
    };
    InfinitelistComponent.prototype.getNodeOffset = function () {
        return this.rootNode.nativeElement[this.currentScrollProp];
    };
    InfinitelistComponent.prototype.scrollTo = function (value) {
        this.rootNode.nativeElement[this.currentScrollProp] = value;
        this.oldOffset = value;
    };
    InfinitelistComponent.prototype.getOffsetForIndex = function (index, scrollToAlignment, itemCount) {
        if (scrollToAlignment === void 0) { scrollToAlignment = this.scrollToAlignment; }
        if (itemCount === void 0) { itemCount = this.itemCount; }
        if (index < 0 || index >= itemCount)
            index = 0;
        return this.sizeAndPositionManager.getUpdatedOffsetForIndex({
            align: this.scrollToAlignment,
            containerSize: this[this.currentSizeProp],
            currentOffset: this.offset || 0,
            targetIndex: index,
        });
    };
    InfinitelistComponent.prototype.getSizeIsPureNumber = function () {
        if (typeof this.itemSize === 'number' || !this.itemSize)
            return true;
        else
            return false;
    };
    InfinitelistComponent.prototype.getSize = function (index) {
        if (typeof this.itemSize === 'function') {
            return this.itemSize(index);
        }
        return Array.isArray(this.itemSize) ? this.itemSize[index] : this.itemSize;
    };
    InfinitelistComponent.prototype.randomColor = function () {
        return '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
    };
    InfinitelistComponent.prototype.recomputeSizes = function (startIndex) {
        if (startIndex === void 0) { startIndex = 0; }
        this.styleCache = {};
        this.sizeAndPositionManager.resetItem(startIndex);
    };
    InfinitelistComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'infinite-list, infinitelist, [infinitelist]',
                    templateUrl: 'infinite-list.component.html',
                    changeDetection: core.ChangeDetectionStrategy.OnPush
                },] },
    ];
    /** @nocollapse */
    InfinitelistComponent.ctorParameters = function () { return []; };
    InfinitelistComponent.propDecorators = {
        'scrollDirection': [{ type: core.Input },],
        'scrollToAlignment': [{ type: core.Input },],
        'overscanCount': [{ type: core.Input },],
        'itemSize': [{ type: core.Input },],
        'data': [{ type: core.Input },],
        'debug': [{ type: core.Input },],
        'unit': [{ type: core.Input },],
        'width': [{ type: core.Input },],
        'height': [{ type: core.Input },],
        'scrollOffset': [{ type: core.Input },],
        'scrollToIndex': [{ type: core.Input },],
        'estimatedItemSize': [{ type: core.Input },],
        'update': [{ type: core.Output },],
        'rootNode': [{ type: core.ViewChild, args: ['dom', { read: core.ElementRef },] },],
    };
    return InfinitelistComponent;
}());
var STYLE_WRAPPER = {
    overflow: 'auto',
    willChange: 'transform',
    WebkitOverflowScrolling: 'touch',
};
var STYLE_INNER = {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    minHeight: '100%',
};
var STYLE_ITEM = {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%'
};

var InfiniteListModule = (function () {
    function InfiniteListModule() {
    }
    InfiniteListModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [InfinitelistComponent],
                    exports: [InfinitelistComponent],
                    imports: [platformBrowser.BrowserModule],
                    providers: []
                },] },
    ];
    /** @nocollapse */
    InfiniteListModule.ctorParameters = function () { return []; };
    return InfiniteListModule;
}());

exports.ILEvent = ILEvent;
exports.ALIGN_AUTO = ALIGN_AUTO;
exports.ALIGN_START = ALIGN_START;
exports.ALIGN_CENTER = ALIGN_CENTER;
exports.ALIGN_END = ALIGN_END;
exports.DIRECTION_VERTICAL = DIRECTION_VERTICAL;
exports.DIRECTION_HORIZONTAL = DIRECTION_HORIZONTAL;
exports.SCROLL_CHANGE_OBSERVED = SCROLL_CHANGE_OBSERVED;
exports.SCROLL_CHANGE_REQUESTED = SCROLL_CHANGE_REQUESTED;
exports.scrollProp = scrollProp;
exports.sizeProp = sizeProp;
exports.positionProp = positionProp;
exports.InfinitelistComponent = InfinitelistComponent;
exports.InfiniteListModule = InfiniteListModule;

Object.defineProperty(exports, '__esModule', { value: true });

})));
