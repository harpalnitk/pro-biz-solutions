import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';


import { ServiceRoutingModule } from './service-routing.module';
import { ServiceComponent } from './service.component';


@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    SharedModule,
    ServiceRoutingModule
  ]
})
export class ServiceModule { }
