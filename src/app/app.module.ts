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
import { MovieElementComponent } from './app-reusables/movElement/movElement';
import { HttpClientModule } from '@angular/common/http';
import { MovieRowComponent } from './app-reusables/movRow/movRow';
import { TMDBService } from './app-services/tmdb-api';

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
    MovieElementComponent,
    MovieRowComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [Users, AuthCheck, TMDBService],
  bootstrap: [MainComponent],
})
export class AppModule {}
