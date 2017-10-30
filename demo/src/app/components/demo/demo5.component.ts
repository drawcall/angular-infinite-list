import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-demo5',
  templateUrl: 'demo5.component.html',
  styleUrls: ['common.css']
})

export class Demo5Component {

  data: { title: number, msg: string }[];
  debug: boolean = true;
  scrollOffset: number = 0;
  event: any;

  ngOnInit() {
    let length: number = 1000;
    this.data = [];

    for (let i: number = 0; i < length; i++) {
      this.data.push({ title: i, msg: 'hello wrold' });
    }
  }

}
