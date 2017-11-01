import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonService } from './common.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/subject';

@Component({
  selector: 'app-demo4',
  templateUrl: 'demo4.component.html',
  styleUrls: ['common.css']
})

export class Demo4Component {

  data: { title: number, msg: string }[];
  scrollToIndex: number = 0;
  scrollToAlignment: string = 'start';
  opts: string[] = ['auto', 'start', 'center', 'end'];
  event: any;
  sub: Subscription;

  constructor(private cdRef: ChangeDetectorRef, private commonService: CommonService) { }

  ngOnInit() {
    this.data = this.commonService.generateData(100000);
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  update($event: Subject<any>) {
    this.sub = $event.subscribe(x => {
      this.cdRef.detectChanges();
      this.event = x;
    });
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
