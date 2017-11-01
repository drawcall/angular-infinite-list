import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { InfinitelistComponent } from './infinite-list.component';
import { InfinitelistService } from './infinite-list.service';

@NgModule({
  declarations: [InfinitelistComponent],
  exports: [InfinitelistComponent],
  imports: [BrowserModule],
  providers: [InfinitelistService]
})

export class InfiniteListModule { }
