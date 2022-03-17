
import { AuthService} from './pages/auth/auth.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { Component, OnInit } from "@angular/core";
import { map, shareReplay } from "rxjs/operators";
import { Observable } from "rxjs";



import * as fromRoot from './app.reducer';
import { Store } from '@ngrx/store';
import { User } from './model/user';
import { AdminConfigService } from './pages/admin/admin-config/admin-config.service';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  isAuth$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private afAuth: AngularFireAuth,
    private adminConfigService: AdminConfigService,
    private store: Store<fromRoot.State>,
    private authService: AuthService,
  

  ) {


    this.initializeApp();
  }

  initializeApp() {
    this.authService.initAuthListener();
  }

  ngOnInit(): void {
   this.adminConfigService.saveConfigData();
   // this.postCategoryService.saveConfigData();
   //this.postCategoryService.allCategories$.subscribe(val=> console.log('Catgories:', val));
   //this.postService.allPosts$.subscribe(val=> console.log('Posts:', val));
   //this.productConfigService.loadConfigData();
  }

  logout() {
    this.afAuth.signOut();
  }
}
