import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { UsersDialogComponent } from './users-dialog/users-dialog.component';


@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    UsersDialogComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
