import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs/subject';
import { CommonService } from './common.service';

@Component({
  selector: 'app-demo3',
  templateUrl: 'demo3.component.html',
  styleUrls: ['common.css']
})

export class Demo3Component {

  data: { title: number, msg: string }[];
  event: any;

  constructor(private cdRef: ChangeDetectorRef, private commonService: CommonService) { }

  ngOnInit() {
    this.data = this.commonService.generateData(100000);
  }

  update($event: Subject<any>) {
    $event.subscribe(x => {
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

}
