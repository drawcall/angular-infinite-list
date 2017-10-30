import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-demo4',
  templateUrl: 'demo4.component.html',
  styleUrls: ['common.css']
})

export class Demo4Component {

  data: { title: number, msg: string }[];
  debug: boolean = true;
  scrollToIndex: number = 0;
  scrollToAlignment: string = 'start';
  opts: string[] = ['auto', 'start', 'center', 'end'];
  event: any;

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

  getClass(i: number): any {
    if (i == this.scrollToIndex) return 'active';
    else return '';
  }

  input() {
    console.log(this.scrollToIndex);
  }
}
