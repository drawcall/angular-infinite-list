import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-demo2',
  templateUrl: 'demo2.component.html',
  styleUrls: ['common.css']
})

export class Demo2Component {

  data: { title: number, msg: string }[];
  debug: boolean = false;
  event: any;

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
