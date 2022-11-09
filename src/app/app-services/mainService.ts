import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class MainService {
  location = {
    current: '',
    route: [''],
  };
  #background = {
    solid: true,
    solidVal: '',
    default: false,
    keepPrev: false,
    interval: 0,
    pause: false,
    images: [''],
  };
  background = new BehaviorSubject({
    solid: true,
    solidVal: '',
    default: false,
    keepPrev: false,
    interval: 0,
    pause: false,
    images: [''],
  });
  nav = new BehaviorSubject({
    active: true,
    hNav: {
      status: 'window',
      category: '',
      logo: 'assets/logo.svg',
      notice: false,
    },
    fNav: {
      userInfo: {},
      config: {
        open: false,
      },
      popup: {},
      messages: {},
    }
  })
  resetBg = () => {
    this.background.next(this.#background);
  };

  constructor(private router: Router) {}
}
