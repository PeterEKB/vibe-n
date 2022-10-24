import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { EmailValidator } from "@angular/forms";
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from "@angular/router";
import { FullNavComponent } from "../app-reusables/app-nav/full-nav/full-nav";
import { BgComponent } from "../app-reusables/bg-component/bg";
import { xNotifications } from "../app-services/notice";
import { Users } from "../app-services/userInfo";


@Component({
    selector: 'main',
    templateUrl: './main.html',
    styleUrls: ['./main.scss'],
    providers: [BgComponent, xNotifications]
})
export class MainComponent implements OnInit, OnDestroy {
    event$
    location = {
        route: [''],
        current: ''
    }
    bgs = {
        interval: 5,
        images: [
            'assets/Collage1.jpg',
            'https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg',
            'https://images7.alphacoders.com/290/290702.jpg',
            'https://i.pinimg.com/originals/61/f4/71/61f471d0eb41616e76533923d76de432.jpg',
            'https://live.staticflickr.com/1904/45226537512_ac046b9599_b.jpg',
            'https://assets.simpleviewinc.com/simpleview/image/upload/c_fill,h_899,q_75,w_1200/v1/clients/lakenorman/Taylor_Christian_2e2d907b-abe8-42f0-9d93-7d55eb16349f.jpg',
            'http://wallup.net/wp-content/uploads/2016/01/245022-nature-landscape-lake-cave-Chile-colorful-water-erosion-rock-rock_formation.jpg'
        ]
    }
    bgImg: string = this.bgs.images[0]
    nav: any = {
        active: true,
        hNav: {
            status: 'window',
            category: '',
            logo: '/assets/logo.svg',
            notice: false
        },
        fNav: {
            userInfo: {},
            config: {
                open: false,
            },
            popup: {},
            messages: {}
        }
    }

    defaultBgs = ['/signin', '/signup']
    disableNav = ['/signin', '/signup']
    //SetInterval index for alternating background (destroyed in ngOnDestroy)
    bgsInterval: any;

    @ViewChild('fNavVC')
    fNavChild!: FullNavComponent

    constructor(
        private router: Router,
        private localUsers: Users,
        private notices: xNotifications) {
        this.event$ = this.router.events
            .subscribe(
                event => {
                    if (event instanceof NavigationStart) {
                        this.location.route.push(event.url)
                        this.location.current = event.url
                    }
                    if (event instanceof (NavigationEnd || NavigationCancel)) {
                        this.afterRoute()
                    }
                }
            );
    }
    ngOnInit(): void { }
    afterRoute(): boolean {
        this.nav.fNav.userInfo = this.userInfo
        if (this.defaultBgs.includes(this.location.current)) {
            this.setBg(this.bgs)
        } else if (this.bgsInterval) {
            clearInterval(this.bgsInterval)
        }
        if (this.disableNav.includes(this.location.current)) {
            this.nav.active = false
        } else {
            this.nav.active = true
        }
        this.noticeHandler()

        return true
    }
    ngOnDestroy(): void {
        this.event$.unsubscribe();
        clearInterval(this.bgsInterval)
    }



    set setBgImg(bg: string) {
        this.bgImg = bg
    }
    get userInfo() {
        if (this.localUsers.current !== undefined)
            return this.localUsers.current.info
        return {}
    }
    get fNav() {
        this.nav.fNav.config.open = true
        return true
    }


    setBg(bg: { interval: number, images: string[] }) {
        let ind = Math.floor(Math.random() * bg.images.length)
        this.setBgImg = bg.images[ind]
        this.bgsInterval = setInterval(() => {
            this.setBgImg = bg.images[ind]
            ind++
            ind < bg.images.length ? '' : ind = 0
        }, bg.interval * 1000)
    }
    fNavEventHandler(e: any) {
        e.path.every((v: any) => {
            if (v.id === 'sOut') {
                localStorage.clear()
                this.nav.fNav.config.open = false
                this.router.navigate(['/signin'])
                return false
            }
            if (e.target.id === 'background') {
                this.nav.fNav.config.open = false
                this.nav.fNav.popup.open = false
                return false
            }
            if (v.id === 'tray' || v.classList.contains('messages')!== undefined) {
                let query = ''
                if (v.classList.contains('messages')) {
                    query = v.getAttribute('identity')
                }else{
                    console.log(v)
                    query = v.querySelector('[identity]').getAttribute('identity')
                }
                const identity = query.split(','),
                    cat = this.nav.fNav.messages[identity[0]],
                    index = cat.findIndex((e: any) => e.msgId == identity[1]),
                    message = cat[index]
                this.nav.fNav.messages.activeId = query
                this.nav.fNav.messages.active = message
                this.fNavChild.catSelect()
                this.nav.fNav.popup.open = true
                return false
            }
            return true
        })
    }
    noticeHandler() {
        const email: string = this.userInfo.email,
            notices = this.notices.notices[email]
        this.nav.fNav.messages = notices
        if (notices) {
            Object.values(notices).every((v: any) => {
                if (document.cookie.match(v[0])) {
                    this.nav.hNav.notice = true
                    return false
                }
                return true
            })
        }
    }
    get notice() {
        const email: string = this.userInfo.email
        let messages = this.notices.notices[email]

        return messages
    }
}