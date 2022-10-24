import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './app-home/home';
import { SignInComponent } from './app-signin/signin';
import { AuthCheck } from './app-services/auth.validator';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthCheck] },
  { path: 'signin', component: SignInComponent },
  { path: 'home', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
export const RoutingComp = [HomeComponent, SignInComponent]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
