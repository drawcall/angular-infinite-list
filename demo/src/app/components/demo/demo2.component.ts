import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonService } from './common.service';
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

  constructor(private cdRef: ChangeDetectorRef, private commonService: CommonService) { }

  ngOnInit() {
    this.data = this.commonService.generateData(100000);
  }

  clone() {
    this.data = this.commonService.clone(this.data);
  }

  update($event: Subject<any>) {
    $event.subscribe(x => {
      this.event = x;
      this.cdRef.detectChanges();
    });
  }
}
