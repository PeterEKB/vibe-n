import { Directive, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { TMDBService } from './tmdb-api';

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
  #_genres: Genre[] = [];
  genres:Observable<Genre[]> = new Observable((observer)=>{
    this.movies
      .getGenres('movie')
      .pipe(
        tap((val: any) => {
          this.#_genres.push(...val);
          observer.next(this.#_genres)
        }),
        take(1)
      )
      .subscribe();
  })
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
    },
  });

  constructor(private router: Router, private movies: TMDBService) {}

  resetBg = () => {
    this.background.next(this.#background);
  };
}
export interface Genre {
  type: string
  genrecode: number
  genre: string
}