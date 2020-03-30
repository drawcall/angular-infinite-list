import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfinitelistComponent } from './infinite-list.component';
import { InfinitelistService } from './infinite-list.service';

@NgModule({
  declarations: [InfinitelistComponent],
  exports: [InfinitelistComponent],
  imports: [CommonModule],
  providers: [InfinitelistService]
})

export class InfiniteListModule { }
