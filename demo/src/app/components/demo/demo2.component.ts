import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonService } from './common.service';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/subject';

@Component({
  selector: 'app-demo2',
  templateUrl: 'demo2.component.html',
  styleUrls: ['common.css']
})

export class Demo2Component {

  data: { title: number, msg: string }[];
  debug: boolean = false;
  event: any;
  sub: Subscription;

  constructor(private cdRef: ChangeDetectorRef, private commonService: CommonService) { }

  ngOnInit() {
    this.data = this.commonService.generateData(100000);
  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }

  clone() {
    this.data = this.commonService.clone(this.data);
  }

  update($event: Subject<any>) {
    this.sub = $event.subscribe(x => {
      this.event = x;
      this.cdRef.detectChanges();
    });
  }
}
