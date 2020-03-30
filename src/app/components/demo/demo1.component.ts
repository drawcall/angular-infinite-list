import { Component, NgModule, ChangeDetectorRef } from '@angular/core';
import { CommonService } from './common.service';

@Component({
  selector: 'app-demo1',
  templateUrl: 'demo1.component.html',
  styleUrls: ['common.css']
})

export class Demo1Component {

  data: { title: number, msg: string }[];
  event: any;
  debug: boolean = false;

  constructor(private commonService: CommonService) { }

  ngOnInit() {
    this.data = this.commonService.generateData(100000);
  }

  clone() {
    this.data = this.commonService.clone(this.data);
  }
}
