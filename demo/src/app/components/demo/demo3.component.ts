import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-demo3',
  templateUrl: 'demo3.component.html',
  styleUrls: ['common.css']
})

export class Demo3Component {

  data: { title: number, msg: string }[];
  event: any;
  debug: boolean = true;

  ngOnInit() {
    let length: number = 1000;
    this.data = [];

    for (let i: number = 0; i < length; i++) {
      this.data.push({ title: i, msg: 'hello wrold' });
    }
  }

  getSize(i: number): number {
    switch (i % 4) {
      case 1:
        return 80;

      case 2:
        return 50;

      case 3:
        return 100;

      default:
        return 150;
    }
  }

  clone() {
    let data = [];
    for (let i = 0; i < this.data.length; i++)
      data.push(this.data[i]);

    this.data = data;
  }
}
