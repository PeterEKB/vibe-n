import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, observable, take } from 'rxjs';

@Injectable()
export class TMDBService {
  private readonly base = 'https://api.themoviedb.org/3/';
  private readonly apiKey = 'api_key=110eda3a8b60f49bec12b7e9da5f0f1b';
  private req: any = observable;
  constructor(private http: HttpClient) {}

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
            img: `https://image.tmdb.org/t/p/w400${val['poster_path']}`,
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
            img: `https://image.tmdb.org/t/p/w400${val['poster_path']}`,
            genres: `${val['genre_ids']}`.split(','),
          };
        });
      }),
      take(1)
    );
    return this.req;
  }
}
