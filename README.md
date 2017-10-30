<div align="center" style="margin-bottom: 30px;">
<img src="https://raw.githubusercontent.com/a-jie/angular-infinite-list/master/imgs/logo.png" width="200"/>
</div>

# 
> A tiny but mighty list virtualization library for angular, with zero dependencies 💪

* **Tiny & dependency free** – Only 3kb gzipped
* **Render millions of items**, without breaking a sweat
* **Scroll to index** or **set the initial scroll offset**
* **Supports fixed** or **variable** heights/widths
* **Vertical** or **Horizontal** lists

This library is transplanted from [react-tiny-virtual-list](https://github.com/clauderic/react-tiny-virtual-list) and [react-virtualized](https://github.com/bvaughn/react-virtualized/).   

Check out the [demo](https://a-jie.github.io/angular-infinite-list) for some examples.

Getting Started
---------------

#### Using [npm](https://www.npmjs.com/):
```
npm install angular-infinite-list --save
```

#### Import angular Infinite list module into your app module

```js
import { InfiniteListModule } from 'angular-infinite-list';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    InfiniteListModule,
    ...
```

#### Wrap Infinite list tag around list items;

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
```

#### Other usage;

```html
<div infinitelist
    [width]='"100%"' 
    [height]='500' 
    [data]='data' 
    [itemSize]='50' 
    (update)='event = $event'>
        <div *ngFor="let item of event?.items; let i=index;" [ngStyle]="event.getStyle(i)">
            {{item|json}}
        </div>
</div>
```


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

#### The IILEvent interface

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
