import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TMDBService } from 'src/app/app-services/tmdb-api';
import { fromEvent, Observable, Subject, Subscription, of } from 'rxjs';
import {
  take,
  timeout,
  takeUntil,
  switchMap,
  tap,
  catchError,
} from 'rxjs/operators';

@Component({
  selector: 'mov-row',
  templateUrl: './movRow.html',
  styleUrls: ['./movRow.scss'],
  providers: [HttpClient, TMDBService],
})
export class MovieRowComponent {
  content: {}[] = [];
  sub$!: Subscription;

  private notifier$ = new Subject();

  @ViewChild('row', { static: true })
  row!: ElementRef;
  @ViewChild('mov')
  mov!: ElementRef;

  pOver$!: Observable<Event>;
  pOut$!: Observable<Event>;
  move$!: Observable<TouchEvent>;
  pDown$!: Observable<Event>;

  subscriptions: Subscription[] = [];
  pOverSub!: Subscription;
  pOutSub!: Subscription;
  moveSub!: Subscription;
  pDownSub!: Subscription;

  @Input()
  data: any;
  @Input()
  parent_scroll: any;

  #_scrolling = false;
  scrollPos = 0;
  scrollIndex = 0;
  trackCap = 8;
  swipeInit!: Number | null;

  class: any = {
    left: {
      hide: true,
      available: false,
    },
    right: {
      hide: true,
      available: true,
    },
  };

  get touchHandler() {
    let dir!: 0 | 1;
    return {
      dir: (v: number) => {
        if (!this.swipeInit) {
          this.swipeInit = v;
          return false;
        } else {
          if (this.swipeInit > v) dir = 1;
          else dir = 0;
          this.swipeInit = null;
          return dir;
        }
      },
    };
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~ lifecycles
  constructor(private movies: TMDBService, private ele: ElementRef) {}

  ngOnInit() {
    this.getMovie();

    this.pOver$ = fromEvent(this.row.nativeElement, 'pointerover');
    this.pOut$ = fromEvent(this.row.nativeElement, 'pointerout');
    this.move$ = fromEvent(this.row.nativeElement, 'touchmove').pipe(
      take(2),
      timeout(700),
      <any>tap((e: TouchEvent) => {
        const th = this.touchHandler.dir(e.touches[0].pageX);
        setTimeout(() => {
          if (!this.parent_scroll)
            if (th !== false)
              th === 0 ? this.scroll('right') : this.scroll('left');
        }, 50);
      }),
      catchError((err) => of(err))
    );
    this.pDown$ = fromEvent(this.row.nativeElement, 'touchstart');

    this.pDown$
      .pipe(
        takeUntil(this.notifier$),
        switchMap((_) => {
          return this.move$;
        }),
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe({ error: console.log });

    this.pOver$.pipe(takeUntil(this.notifier$)).subscribe(() => {
      this.preNxtOpacity.hide(false);
    });

    this.pOutSub = this.pOut$.pipe(takeUntil(this.notifier$)).subscribe(() => {
      this.preNxtOpacity.hide(true);
    });
  }
  ngAfterViewInit() {
    this.row.nativeElement.style.setProperty('--mov-num', this.trackCap);
  }
  ngOnDestoy() {
    this.stopObs();
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~ methods
  get preNxtOpacity() {
    return {
      hide: (v: boolean) => {
        this.class.left.hide = v;
        this.class.right.hide = v;
      },
      availability: (ele: string, v: boolean) => {
        if (['pre'].includes(ele)) {
          this.class.left.available = v;
        } else {
          this.class.right.available = v;
        }
      },
    };
  }

  scroll(dir: 'left' | 'right') {
    const dirVal = dir === 'left' ? -1 : 1;

    if (!this.#_scrolling) {
      const mov = this.mov.nativeElement.querySelectorAll('mov-ele');

      this.#_scrolling = true;
      
      setTimeout(() => {
        this.#_scrolling = false;
      }, 500);

      if (
        (this.scrollIndex <= 0 && dir === 'right') ||
        (this.scrollIndex >= 4 && dir === 'left')
      ) {
      } else {
        this.scrollPos += dirVal * this.trackCap;
        this.scrollIndex -= dirVal;
        this.row.nativeElement.style.setProperty('--pos', this.scrollPos);

        switch (this.scrollIndex) {
          case 0:
            this.preNxtOpacity.availability('pre', false);
            this.preNxtOpacity.availability('nxt', true);
            break;
          case 4:
            this.preNxtOpacity.availability('nxt', false);
            this.preNxtOpacity.availability('pre', true);
            break;
          default:
            this.preNxtOpacity.availability('nxt', true);
            this.preNxtOpacity.availability('pre', true);
        }
      }
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~ helper
  private stopObs() {
    this.notifier$.next(null);
    this.notifier$.complete();
  }
  private getMovie() {
    this.movies
      .reqMov(this.data, 1)
      .pipe(takeUntil(this.notifier$))
      .subscribe((val: any[]) => {
        this.content.push(...val);
      });
    this.movies
      .reqMov(this.data, 2)
      .pipe(takeUntil(this.notifier$))
      .subscribe((val: any[]) => {
        this.content.push(...val);
      });
  }
}
