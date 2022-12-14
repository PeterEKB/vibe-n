import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { fromEvent, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { Genre, MainService } from '../app-services/mainService';
import { TMDBService } from '../app-services/tmdb-api';
import { YouTubeService } from '../app-services/youtube-api';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  providers: [YouTubeService],
})
export class HomeComponent {
  #data!: Genre[];
  data!: Genre[];
  dataLoad: number = 0;
  dataLoadAmt: number = 3;
  featuredMov: any;

  scrolling = false;
  private trending: any = [];
  private bCS_base = 'https://www.youtube.com/embed/';
  private bCS_videoId = '';
  private bCS_params = '?enablejsapi=1&mute=1&controls=0';
  private bannerClipSrc: string = '';
  safeClipSrc: any = this.sanitizer.bypassSecurityTrustResourceUrl(
    this.bannerClipSrc
  );
  bannerImg: string = '';
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
    private cd: ChangeDetectorRef,
    private movies: TMDBService
  ) {
    this.main.resetBg();
    this.main.background.next({
      ...this.main.background.getValue(),
      solidVal: 'background: black',
    });
    this.main.nav.next({ ...this.main.nav.getValue(), active: true });
    this.movies.getTrending.pipe(take(1)).subscribe((val: any) => {
      this.trending = val;
      this.featuredMov = this.trending[0];
      this.bannerImg = this.trending[0].img.banner.original;
      this.yt.getTrailer(this.trending[0].title).pipe(take(1)).subscribe((tag:any)=>{
      this.bCS_videoId = tag.items[0].id.videoId
      this.updateVideoUrl(this.bCS_videoId);
      })
      // this.bCS_videoId = '_Z3QKkl1WyM';
      // this.updateVideoUrl(this.bCS_videoId);
    });
    if (!yt.exists.player) {
      this.yt.loadAPI();
    }
  }

  ngOnInit() {
    this.main.genres.pipe(take(1)).subscribe((val) => {
      this.#data = val;
      this.data = this.#data.slice(0, this.dataLoad);
      this.scrollPosHandler();
    });
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
        this.scrollPosHandler(0);
        this.yt.video = 0;
        this.yt.video = 'play';
        this.yt.volume = 'unMute';
        this.#volume = true;
        break;
      default:
        if (this.yt.volume.isMuted) {
          this.yt.volume = 'unMute';
          this.yt.video = 'play';
          this.#volume = true;
        } else {
          this.yt.volume = 'mute';
          this.#volume = false;
        }
        break;
    }
  }
  scrollPosHandler(val?: number) {
    const def = this.main.nav.getValue(),
      alt = def.hNav,
      ele = this.content.nativeElement,
      scrollPos = ele.scrollTop,
      height = ele.querySelector('mov-ele')
        ? ele.querySelector('mov-ele').clientHeight
        : 0,
      scrollHeight = ele.scrollHeight - ele.clientHeight,
      overFlow = scrollHeight - height * this.dataLoadAmt
    if (scrollPos >= overFlow && this.dataLoad < this.#data.length) {
      this.dataLoad += this.dataLoadAmt;
      this.data = this.#data.slice(0, this.dataLoad);
      console.log(scrollHeight);
    }

    if (val !== undefined) this.content.nativeElement.scrollTo(0, 0);

    if (this.content.nativeElement.scrollTop <= 30) {
      this.main.nav.next({ ...def, hNav: { ...alt, status: 'shadow' } });
      if (this.playerState.status === 'paused') this.yt.video = 'play';
    } else {
      this.main.nav.next({ ...def, hNav: { ...alt, status: 'window' } });
      if (this.playerState.status === 'playing') this.yt.video = 'pause';
    }
  }
}
