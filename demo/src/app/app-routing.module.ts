import { NgModule } from '@angular/core';
import { Routes, Router, ActivatedRoute, RouterModule } from '@angular/router';

import { Demo1Component } from './components/demo/demo1.component';
import { Demo2Component } from './components/demo/demo2.component';
import { Demo3Component } from './components/demo/demo3.component';
import { Demo4Component } from './components/demo/demo4.component';
import { Demo5Component } from './components/demo/demo5.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', redirectTo: '/demo1', pathMatch: 'full' },
            { path: 'demo1', component: Demo1Component },
            { path: 'demo2', component: Demo2Component },
            { path: 'demo3', component: Demo3Component },
            { path: 'demo4', component: Demo4Component },
            { path: 'demo5', component: Demo5Component },
        ], { useHash: true })
    ],
    exports: [RouterModule],
    providers: []
})

export class AppRoutingModule {
}
