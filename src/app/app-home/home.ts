import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  BehaviorSubject,
  fromEvent,
  interval,
  Observable,
  Subject,
  take,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { MainService } from '../app-services/mainService';
import { YouTubeService } from '../app-services/youtube-api';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  providers: [YouTubeService],
})
export class HomeComponent {
  data: any = [
    {
      type: 'movie',
      genrecode: 28,
      genre: 'Action',
    },
    {
      type: 'movie',
      genrecode: 12,
      genre: 'Adventure',
    },
    {
      type: 'movie',
      genrecode: 16,
      genre: 'Animation',
    },
    {
      type: 'movie',
      genrecode: 35,
      genre: 'Comedy',
    },
    {
      type: 'movie',
      genrecode: 80,
      genre: 'Crime',
    },
  ];

  scrolling = false;
  private bCS_base = 'https://www.youtube.com/embed/';
  private bCS_videoId = 'X0tOpBuYasI';
  private bCS_params = '?enablejsapi=1&mute=1&controls=0';
  private bannerClipSrc!: string;
  safeClipSrc!: any;
  bannerImg: string = `https://i.ytimg.com/vi/${this.bCS_videoId}/maxresdefault.jpg`;
  classes: any = {
    vidImg: {
      hide: false,
    },
  };

  @ViewChild('main', { static: true })
  content!: ElementRef;

  private notifier$ = new Subject();
  scroll$!: Observable<Event>;
  timer!: any;

  #playerReady: any = false;
  #playerState: any = 0;
  #volume: any = false;
  get playerReady(): any {
    return this.#playerReady;
  }
  set playerReady(val) {
    this.#playerReady = val;
    if (val === true) {
      this.yt.video = 'play';
    }
  }
  get playerState(): any {
    return this.#playerState;
  }
  set playerState(val) {
    this.#playerState = val;
    if (['playing', 'paused', 'ended'].includes(val.status)) {
      this.bannerVideoHandler();
    }
  }
  get volume(): any {
    return this.#volume;
  }
  set volume(val) {
    this.#volume = val;
    if (['playing', 'paused', 'ended'].includes(val.status)) {
      this.bannerVideoHandler();
    }
  }
  constructor(
    private sanitizer: DomSanitizer,
    private yt: YouTubeService,
    private main: MainService,
    private cd: ChangeDetectorRef
  ) {
    this.main.resetBg();
    this.main.background.next({
      ...this.main.background.getValue(),
      solidVal: 'background: black',
    });
    this.main.nav.next({ ...this.main.nav.getValue(), active: true });
    this.yt.loadAPI();
  }

  ngOnInit() {
    this.scrollPosHandler();
    this.yt.playerReady
      .pipe(
        tap((val) => {
          this.playerReady = val;
        }),
        takeUntil(this.notifier$)
      )
      .subscribe();
    this.yt.playerState
      .pipe(
        tap((val) => {
          this.playerState = val;
        }),
        takeUntil(this.notifier$)
      )
      .subscribe();

    this.updateVideoUrl(this.bCS_videoId);
    this.scroll$ = fromEvent(this.content.nativeElement, 'scroll');

    this.scroll$
      .pipe(
        takeUntil(this.notifier$),
        tap(() => {
          this.scrollPosHandler();
        })
      )
      .subscribe((e) => {
        clearTimeout(this.timer);
        this.scrolling = true;
        this.timer = setTimeout(() => {
          this.scrolling = false;
        }, 100);
      });
  }
  ngOnDestroy() {
    this.stopObs();
  }

  private stopObs() {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
  updateVideoUrl(id: string) {
    this.bannerClipSrc = this.bCS_base + id + this.bCS_params;
    this.safeClipSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.bannerClipSrc
    );
  }
  bannerVideoHandler() {
    switch (this.playerState.status) {
      case 'playing':
        this.classes.vidImg.hide = true;
        break;
      default:
        this.classes.vidImg.hide = false;
        break;
    }
    this.cd.detectChanges();
  }
  actionHandler() {
    switch (this.playerState.status) {
      case 'paused':
        this.scrollPosHandler(0)
        this.yt.video = 0;
        this.yt.video = 'play';
        this.yt.volume = 'unMute';
        this.#volume = true
        break;
      default:
        if (this.yt.volume.isMuted) {
          this.yt.volume = 'unMute';
          this.yt.video = 'play';
          this.#volume = true
        } else {
          this.yt.volume = 'mute';
          this.#volume = false
        }
        break;
    }
  }
  scrollPosHandler(val?: number) {
    const def = this.main.nav.getValue(),
      alt = def.hNav;

    if (val !== undefined) this.content.nativeElement.scrollTo(0,0);

    if (this.content.nativeElement.scrollTop <= 30) {
      this.main.nav.next({ ...def, hNav: { ...alt, status: 'shadow' } });
      console.log(this.playerState);
      if (this.playerState.status === 'paused') this.yt.video = 'play';
    } else {
      this.main.nav.next({ ...def, hNav: { ...alt, status: 'window' } });
      if (this.playerState.status === 'playing') this.yt.video = 'pause';
    }
  }
}
