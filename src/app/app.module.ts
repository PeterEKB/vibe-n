import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MainComponent } from './app-main/main';

import { AppRoutingModule, RoutingComp } from './app-routing.module';
import { BgComponent } from './app-reusables/bg-component/bg';
import { MgComponent } from './app-reusables/mg-component/mg';
import { InputFull } from './app-reusables/input-full/input-full';
import { ButtonRSComponent } from './app-reusables/btn-rnd-sqr/btn-rnd-sqr';
import { HeaderNavComponent } from './app-reusables/app-nav/header-nav/header-nav';
import { FullNavComponent } from './app-reusables/app-nav/full-nav/full-nav';
import { Users } from './app-services/userInfo';
import { AuthCheck } from './app-services/auth.validator';

@NgModule({
  declarations: [
    MainComponent,
    RoutingComp,
    BgComponent,
    MgComponent,
    InputFull,
    ButtonRSComponent,
    HeaderNavComponent,
    FullNavComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    Users, 
    AuthCheck
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
