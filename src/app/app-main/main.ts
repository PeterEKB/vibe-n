import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmailValidator } from '@angular/forms';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { tap } from 'rxjs';
import { FullNavComponent } from '../app-reusables/app-nav/full-nav/full-nav';
import { BgComponent } from '../app-reusables/bg-component/bg';
import { MainService } from '../app-services/mainService';
import { xNotifications } from '../app-services/notice';
import { Users } from '../app-services/userInfo';

@Component({
  selector: 'main',
  templateUrl: './main.html',
  styleUrls: ['./main.scss'],
  providers: [BgComponent, xNotifications, MainService],
})
export class MainComponent implements OnInit, OnDestroy {
  router$;
  location = {
    route: [''],
    current: '',
  };
  bgs: any = {};
  bgData = {
    activate: true,
    src: '',
    styles: {},
  };
  nav: any = {};
  // disableNav = ['/signin', '/signup'];
  //SetInterval index for alternating background (destroyed in ngOnDestroy)
  bgsInterval: any;

  @ViewChild('fNavVC')
  fNavChild!: FullNavComponent;

  constructor(
    private router: Router,
    private localUsers: Users,
    private notices: xNotifications,
    private main: MainService
  ) {
    this.router$ = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.location.route.push(event.url);
        this.location.current = event.url;
        main.location = this.location;
      }
      if (event instanceof (NavigationEnd || NavigationCancel)) {
        this.afterRoute();
      }
    });
  }
  ngOnInit(): void {
    this.bgs = this.main.background
      .pipe(
        tap((val) => {
          this.bgs = val;
          this.handleBg();
        })
      )
      .subscribe();
    this.bgs = this.main.nav
      .pipe(
        tap((val) => {
          this.nav = val;
        })
      )
      .subscribe();
  }
  afterRoute(): boolean {
    this.nav.fNav.userInfo = this.userInfo;
    // if (this.disableNav.includes(this.location.current)) {
    //   this.nav.active = false;
    // } else {
    //   this.nav.active = true;
    // }
    this.noticeHandler();

    return true;
  }
  ngOnDestroy(): void {
    this.router$.unsubscribe();
    clearInterval(this.bgsInterval);
  }

  set setBgImg(bg: string) {
    this.bgData.src = bg;
  }
  get userInfo() {
    if (this.localUsers.current !== undefined)
      return this.localUsers.current.info;
    return {};
  }
  fNav(e: any) {
    if (e.target.id === 'burger') {
      this.nav.fNav.config.open = true;
    }
  }

  handleBg() {
    const bg = this.bgs;
    if (bg.solid) {
      this.bgData.activate = false;
      this.bgData.styles = bg.solidVal;
      if (this.bgsInterval) {
        clearInterval(this.bgsInterval);
      }
    } else {
      this.bgData.activate = true;
      if (!bg.keepPrev) {
        if (!bg.default) {
          if (this.bgsInterval) {
            clearInterval(this.bgsInterval);
          }
          if (this.bgs.interval) {
            this.setBg({ interval: bg.interval, images: bg.images });
          }
        } else {
          if (this.bgsInterval) {
            clearInterval(this.bgsInterval);
          }
          this.setBg = bg.default;
        }
      } else {
        if (bg.pause) {
          if (this.bgsInterval) {
            clearInterval(this.bgsInterval);
          }
        }
      }
    }
  }
  setBg(bg: { interval: number; images: string[] }) {
    let ind = Math.floor(Math.random() * bg.images.length);
    this.setBgImg = bg.images[ind];
    this.bgsInterval = setInterval(() => {
      ind++;
      ind < bg.images.length ? '' : (ind = 0);
      this.setBgImg = bg.images[ind];
    }, bg.interval * 1000);
  }
  fNavEventHandler(e: any) {
    e.path.every((v: any) => {
      if (v.id === 'sOut') {
        localStorage.clear();
        this.nav.fNav.config.open = false;
        this.nav.fNav.popup.open = false;
        this.router.navigate(['/signin']);
        return false;
      }
      if (e.target.id === 'background') {
        this.nav.fNav.config.open = false;
        this.nav.fNav.popup.open = false;
        return false;
      }
      if (v.id === 'tray' || v.classList.contains('messages') !== undefined) {
        let query = '';
        if (v.classList.contains('messages')) {
          query = v.getAttribute('identity');
        } else {
          query = v.querySelector('[identity]')
            ? v.querySelector('[identity]').getAttribute('identity')
            : false;
          }
          if (!query) return;
        const identity = query.split(','),
          cat = this.nav.fNav.messages[identity[0]],
          index = cat.findIndex((e: any) => e.msgId == identity[1]),
          message = cat[index];
        this.nav.fNav.messages.activeId = query;
        this.nav.fNav.messages.active = message;
        this.fNavChild.catSelect();
        this.nav.fNav.popup.open = true;
        return false;
      }
      return true;
    });
  }
  noticeHandler() {
    const email: string = this.userInfo.email,
      notices = this.notices.notices[email],
      tmp = this.main.nav.getValue();
    this.main.nav.next({ ...tmp, fNav: { ...tmp.fNav, messages: notices } });
    if (notices) {
      Object.values(notices).every((v: any) => {
        if (document.cookie.match(v[0])) {
          const val = this.main.nav.getValue();
          this.main.nav.next({ ...val, hNav: { ...val.hNav, notice: true } });
          return false;
        }
        return true;
      });
    }
  }
  get notice() {
    const email: string = this.userInfo.email;
    let messages = this.notices.notices[email];

    return messages;
  }
}
