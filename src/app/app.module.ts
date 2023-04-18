import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { InfiniteListModule } from 'angular-infinite-list';

import { AppRoutingModule } from './app-routing.module';

import { NavBarComponent } from './components/navbar/navbar.component';
import { SideBarComponent } from './components/sidebar/sidebar.component';

import { Demo1Component } from './components/demo/demo1.component';
import { Demo2Component } from './components/demo/demo2.component';
import { Demo3Component } from './components/demo/demo3.component';
import { Demo4Component } from './components/demo/demo4.component';
import { Demo5Component } from './components/demo/demo5.component';

import { AppComponent } from './app.component';

import { CommonService } from './components/demo/common.service';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    InfiniteListModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule
  ],

  declarations: [
    AppComponent,
    NavBarComponent,
    SideBarComponent,
    Demo1Component,
    Demo2Component,
    Demo3Component,
    Demo4Component,
    Demo5Component,
  ],

  providers: [CommonService],
  bootstrap: [AppComponent],
})

export class AppModule { }
