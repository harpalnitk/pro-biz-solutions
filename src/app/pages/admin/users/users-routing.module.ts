import { UserHistoryComponent } from './user/user-history/user-history.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import {UserResolver} from './user.resolver';
import { UsersComponent } from './users.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
{
  path: ":id",
  component: UserComponent,
  resolve: { item: UserResolver },
  children: [{ path: "history", component: UserHistoryComponent }],
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
