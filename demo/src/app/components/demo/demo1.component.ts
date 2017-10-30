import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-demo1',
  templateUrl: 'demo1.component.html',
  styleUrls: ['common.css']
})

export class Demo1Component {

  data: { title: number, msg: string }[];
  event: any;
  debug: boolean = false;

  ngOnInit() {
    let length: number = 1000;
    this.data = [];

    for (let i: number = 0; i < length; i++) {
      this.data.push({ title: i, msg: 'hello wrold' });
    }
  }

  clone() {
    let data = [];
    for (let i = 0; i < this.data.length; i++)
      data.push(this.data[i]);

    this.data = data;
  }
}
