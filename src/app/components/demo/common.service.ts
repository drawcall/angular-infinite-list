import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  generateData(length: number = 100000): { title: number, msg: string }[] {
    let data: { title: number, msg: string }[] = [];

    for (let i: number = 0; i < length; i++) {
      data.push({ title: i, msg: 'hello wrold' });
    }

    return data;
  }

  clone(target: any[]): any[] {
    let data = [];
    for (let i = 0; i < target.length; i++)
      data.push(target[i]);

    return data;
  }

}
