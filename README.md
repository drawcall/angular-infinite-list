<div align="center" style="margin-bottom: 30px;">
<img src="https://raw.githubusercontent.com/a-jie/angular-infinite-list/master/imgs/logo.png" width="200"/>
</div>

# 
> A short and powerful infinite scroll list library for angular, with zero dependencies 💪

* **Tiny & dependency free** – Only 3kb gzipped
* **Render millions of items**, without breaking a sweat
* **Scroll to index** or **set the initial scroll offset**
* **Supports fixed** or **variable** heights/widths
* **Vertical** or **Horizontal** lists

This library is transplanted from [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) and [react-virtualized](https://github.com/bvaughn/react-virtualized/).   

Check out the [demo](https://a-jie.github.io/angular-infinite-list) for some examples.

Getting Started
---------------

### Using [npm](https://www.npmjs.com/):
```
npm install angular-infinite-list --save
```

### Import angular Infinite list module into your app module

```js
import { InfiniteListModule } from 'angular-infinite-list';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    InfiniteListModule,
    ...
```

### Wrap Infinite list tag around list items

```html
<infinitelist
    [width]='"100%"' 
    [height]='500' 
    [data]='data' 
    [itemSize]='50' 
    (update)='event = $event'>
        <div *ngFor="let item of event?.items; let i=index;" [ngStyle]="event.getStyle(i)">
            item{{event.start + i}} : {{item|json}}
        </div>
</infinitelist>

or directive usage
<div infinitelist [width]='"100%"' ...</div>
```

### Higher performance usage
> Because in the angular all the asynchronous operation will cause change detection.High-frequency operations such as the scroll event can cause significant performance losses.

> So in some high-precision scenes, we can use [rxjs](https://github.com/Reactive-Extensions/RxJS) [Observable](https://medium.com/google-developer-experts/angular-introduction-to-reactive-extensions-rxjs-a86a7430a61f) to solve.
> About angular asynchronous, change detection checks and zone.js.
You can view it
[zone.js](https://blog.thoughtram.io/angular/2016/02/01/zones-in-angular-2.html) and [change detection](https://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html)

#### set @Input `[useob]='true'` and use `ChangeDetectorRef `
You can switch to the Observable mode. of course, if your scene on the efficiency requirements are not high can not do so.

###### demo.component.html
```html
<infinitelist
    [[width]='"100%"' 
    [height]='500' 
    [data]='data' 
    [itemSize]='150' 
    [useob]='true'
    (update)='update($event)'>
        <div class="li-con" *ngFor="let item of event?.items; let i=index;" [ngStyle]="event.getStyle(i)">
            item{{event.start + i}}
        </div>
</infinitelist>
```
###### demo.component.ts
>Notice! useob mode update trigger once and otherwise it will trigger multiple times

```
event: ILEvent;
constructor(private cdRef: ChangeDetectorRef) { }
  
//Notice! useob mode update trigger once and otherwise it will trigger multiple times
update($event: Subject<any>) {
    $event.subscribe(x => {
		this.event = x;
      	this.cdRef.detectChanges();
	});
}
```
[view demo code](https://github.com/a-jie/angular-infinite-list/blob/master/demo/src/app/components/demo/demo2.component.ts)


### Prop Types
| Property          | Type              | Required? | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
|:------------------|:------------------|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| width             | Number or String* | ✓         | Width of List. This property will determine the number of rendered items when scrollDirection is `'horizontal'`.                                                                                                                                                                                                                                                                                                                     |
| height            | Number or String* | ✓         | Height of List. This property will determine the number of rendered items when scrollDirection is `'vertical'`.                                                                                                                                                                                                                                                                                                                      |
| data        | any[]          | ✓         | The data that builds the templates within the Infinite scroll.                                                                                                                                                                                                                                                                        |
| itemSize          |                   | ✓         | Either a fixed height/width (depending on the scrollDirection), an array containing the heights of all the items in your list, or a function that returns the height of an item given its index: `(index: number): number`                                                                                                                                                                                                           |
| scrollDirection   | String            |           | Whether the list should scroll vertically or horizontally. One of `'vertical'` (default) or `'horizontal'`.                                                                                                                                                                                                                                                                                                                          |
| scrollOffset      | Number            |           | Can be used to control the scroll offset; Also useful for setting an initial scroll offset                                                                                                                                                                                                                                                                                                                                           |
| scrollToIndex     | Number            |           | Item index to scroll to (by forcefully scrolling if necessary)                                                                                                                                                                                                                                                                                                                                                                       |
| scrollToAlignment | String            |           | Used in combination with `scrollToIndex`, this prop controls the alignment of the scrolled to item. One of: `'start'`, `'center'`, `'end'` or `'auto'`. Use `'start'` to always align items to the top of the container and `'end'` to align them bottom. Use `'center`' to align them in the middle of the container. `'auto'` scrolls the least amount possible to ensure that the specified `scrollToIndex` item is fully visible. |
| overscanCount     | Number            |           | Number of extra buffer items to render above/below the visible items. Tweaking this can help reduce scroll flickering on certain browsers/devices.                                                                                                                                                                                                                                                                                   |
| estimatedItemSize | Number            |           | Used to estimate the total size of the list before all of its items have actually been measured. The estimated total height is progressively adjusted as items are rendered.                                                                                                                                                                                                                                                         |
| update    | Output          |           | This event is fired every time when dom scroll. The event sent by the parameter is a ILEvent object.                                                                                                                                                                                                                                                                      |

*\* Width may only be a string when `scrollDirection` is `'vertical'`. Similarly, Height may only be a string if `scrollDirection` is `'horizontal'`*

### The IILEvent interface

```
export interface IILEvent {
    items: any[],
    offset: number,
    getStyle(index: number): any,
    data?: any[],
    start?: number,
    stop?: number
}
```

## Reporting Issues
Found an issue? Please [report it](https://github.com/a-jie/angular-infinite-list/issues) along with any relevant details to reproduce it.

## Acknowledgments
This library is transplanted from [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) and [react-virtualized](https://github.com/bvaughn/react-virtualized/). 
Thanks for the great works of author [Claudéric Demers](https://twitter.com/clauderic_d) ❤️

## License
 is available under the MIT License.
