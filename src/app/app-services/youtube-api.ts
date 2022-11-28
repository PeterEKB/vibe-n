import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  Subject,
  take,
  takeUntil,
  tap,
  windowWhen,
} from 'rxjs';

@Injectable()
export class YouTubeService {
  private base: string =
    'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&type=video&key=';
  private apiKey: string = 'AIzaSyAHQzOaAPg_k2K7Lea8RJR3hDSLi5Lbd8c';

  private notifier$ = new Subject();
  playerReady = new Observable((observer) => {
    (window as any)['playerReady']
      .pipe(
        tap((e: any) => {
          observer.next(e);
        }),
        takeUntil(this.notifier$)
      )
      .subscribe();
  });
  playerState = new Observable((observer) => {
    (window as any)['playerState']
      .pipe(
        tap((e: any) => {
          const val = this.checkState(e.data);
          observer.next(val);
        }),
        takeUntil(this.notifier$)
      )
      .subscribe();
  });
  get video() {
    return {
      time: (window as any)['player'].getCurrentTime(),
      duration: (window as any)['player'].getDuration(),
      ready: (window as any)['playerReady'],
    };
  }
  set video(val: any) {
    switch (val) {
      case 'play':
        (window as any)['player'].playVideo();
        break;
      case 'pause':
        (window as any)['player'].pauseVideo();
        break;
      case 'stop':
        (window as any)['player'].stopVideo();
        break;
      default:
        if (typeof val === 'number') (window as any)['player'].seekTo(val);
        break;
    }
  }
  get volume() {
    return {
      isMuted: (window as any)['player'].isMuted(),
      volume: (window as any)['player'].getVolume(),
    };
  }
  set volume(val: any) {
    switch (val) {
      case 'mute':
        (window as any)['player'].mute();
        break;
      case 'unMute':
        (window as any)['player'].unMute();
        break;
      default:
        if (typeof val === 'number') (window as any)['player'].setVolume(val);
        break;
    }
  }
  get exists() {
    return {
      player: (window as any)['player'] ? true : false,
      YT: (window as any)['YT'] ? true : false,
    };
  }

  constructor(private http: HttpClient) {}

  ngOnDestroy() {
    this.stopObs();
    (window as any)['YT'] = null
    delete (window as any)['player']
  }

  private stopObs() {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
  private checkState(val: number) {
    switch (val) {
      case -1:
        return { key: val, status: 'unstarted' };
        break;
      case 0:
        return { key: val, status: 'ended' };
        break;
      case 1:
        return { key: val, status: 'playing' };
        break;
      case 2:
        return { key: val, status: 'paused' };
        break;
      case 3:
        return { key: val, status: 'buffering' };
        break;
      case 5:
        return { key: val, status: 'error' };
        break;
      default:
        return { key: val, status: 'error' };
    }
  }

  public getTrailer(title: string) {
    const t = title.replace(' ', '-') + 'official-trailer',
      query = this.base + this.apiKey + '&q=' + t,
      result =
      this.http.get(query).pipe(take(1),tap(console.log));

    return result;
  }
  public loadAPI() {
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    let firstScriptTag: any = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    (window as any)['player'];
    (window as any)['playerState'] = new BehaviorSubject(-1);
    (window as any)['playerReady'] = new BehaviorSubject(-1);
    (window as any)['onYouTubeIframeAPIReady'] = function () {
      (window as any)['player'] = new (window as any)['YT'].Player('player', {
        events: {
          onReady: (window as any)['onPlayerReady'],
          onStateChange: (window as any)['onPlayerStateChange'],
          onerror: console.log,
        },
      });
    };

    (window as any)['onPlayerReady'] = () => {
      (window as any)['playerReady'].next(true);
    };
    (window as any)['onPlayerStateChange'] = (e: any) => {
      (window as any)['playerState'].next(e);
    };
  }
}
