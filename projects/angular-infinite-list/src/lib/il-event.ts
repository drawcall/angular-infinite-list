export interface IILEvent {
    items: any[],
    offset: number,
    getStyle(index: number): any,
    data?: any[],
    start?: number,
    stop?: number
}

export class ILEvent implements IILEvent {
    items: any[];
    offset: number = 0;
    data: any[];
    start: number = 0;
    stop: number = 0;

    getStyle(index: number): any { }
}
