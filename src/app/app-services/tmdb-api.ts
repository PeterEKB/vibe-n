import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, observable, take } from 'rxjs';

@Injectable()
export class TMDBService {
  private readonly base = 'https://api.themoviedb.org/3/';
  private readonly apiKey = 'api_key=110eda3a8b60f49bec12b7e9da5f0f1b';
  private req: any = observable;
  constructor(private http: HttpClient) {}

  getGenres(type: string) {
    const api =
      `https://api.themoviedb.org/3/genre/${type}/list?` + this.apiKey;
    this.req = this.http.get(api).pipe(
      map((mov: any) => {
        return mov.genres.map((val: any) => {
          return {
            type,
            genrecode: val.id,
            genre: val.name,
          };
        });
      }),
      take(1)
    );
    return this.req;
  }
  reqMov(data: any, page: number) {
    const query =
      this.base +
      'discover/movie?' +
      this.apiKey +
      '&with_genres=' +
      data.genrecode +
      '&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=true&page=' +
      page +
      '&with_watch_monetization_types=free';
    this.req = this.http.get(query).pipe(
      map((mov: any) => {
        return mov.results.map((val: any) => {
          return {
            id: `${val['id']}`,
            title: `${val['title']}`,
            overview: `${val['overview']}`,
            img: {
              banner: {
                original: `https://image.tmdb.org/t/p/original${val['backdrop_path']}`,
                300: `https://image.tmdb.org/t/p/w300${val['backdrop_path']}`,
                400: `https://image.tmdb.org/t/p/w400${val['backdrop_path']}`,
                500: `https://image.tmdb.org/t/p/w500${val['backdrop_path']}`,
                600: `https://image.tmdb.org/t/p/w600${val['backdrop_path']}`,
                700: `https://image.tmdb.org/t/p/w700${val['backdrop_path']}`,
              },
              poster: {
                300: `https://image.tmdb.org/t/p/w300${val['poster_path']}`,
                400: `https://image.tmdb.org/t/p/w400${val['poster_path']}`,
                500: `https://image.tmdb.org/t/p/w500${val['poster_path']}`,
                600: `https://image.tmdb.org/t/p/w600${val['poster_path']}`,
                700: `https://image.tmdb.org/t/p/w700${val['poster_path']}`,
              },
            },
            genres: `${val['genre_ids']}`.split(','),
          };
        });
      }),
      take(1)
    );
    return this.req;
  }
  get getTrending() {
    const api = 'https://api.themoviedb.org/3/trending/all/day?' + this.apiKey;
    this.req = this.http.get(api).pipe(
      map((mov: any) => {
        return mov.results.map((val: any) => {
          return {
            id: `${val['id']}`,
            title: `${val['title']}`,
            overview: `${val['overview']}`,
            img: {
              banner: {
                original: `https://image.tmdb.org/t/p/original${val['backdrop_path']}`,
                300: `https://image.tmdb.org/t/p/w300${val['backdrop_path']}`,
                400: `https://image.tmdb.org/t/p/w400${val['backdrop_path']}`,
                500: `https://image.tmdb.org/t/p/w500${val['backdrop_path']}`,
                600: `https://image.tmdb.org/t/p/w600${val['backdrop_path']}`,
                700: `https://image.tmdb.org/t/p/w700${val['backdrop_path']}`,
              },
              poster: {
                300: `https://image.tmdb.org/t/p/w300${val['poster_path']}`,
                400: `https://image.tmdb.org/t/p/w400${val['poster_path']}`,
                500: `https://image.tmdb.org/t/p/w500${val['poster_path']}`,
                600: `https://image.tmdb.org/t/p/w600${val['poster_path']}`,
                700: `https://image.tmdb.org/t/p/w700${val['poster_path']}`,
              },
            },
            genres: `${val['genre_ids']}`.split(','),
          };
        });
      }),
      take(1)
    );
    return this.req;
  }
}
