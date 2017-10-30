import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { InfinitelistComponent } from './infinite-list.component';

@NgModule({
  declarations: [InfinitelistComponent],
  exports: [InfinitelistComponent],
  imports: [BrowserModule],
  providers: []
})

export class InfiniteListModule { }
