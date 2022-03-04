import { WelcomeComponent } from './core/welcome/welcome.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    { path: 'home', component: WelcomeComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    { path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule) },
    { path: 'products', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule) },
 
    { path: 'auth', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
    { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule) },
  
  
 
  
    {
        path: "**",
        redirectTo: '/home'
    }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
