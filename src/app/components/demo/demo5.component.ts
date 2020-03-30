import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';
import { CommonService } from './common.service';

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

}
