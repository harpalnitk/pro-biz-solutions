import { UserHistoryComponent } from './user/user-history/user-history.component';
import { UserComponent } from './user/user.component';
import { NgModule } from '@angular/core';


import { UsersRoutingModule } from './users-routing.module';
import { UsersComponent } from './users.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [
    UsersComponent,
    UsersTableComponent,
    UserDialogComponent,
    UserComponent,
    UserHistoryComponent
  ],
  imports: [
   SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
