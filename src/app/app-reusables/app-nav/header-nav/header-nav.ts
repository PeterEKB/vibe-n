import { Component, Input } from "@angular/core";


@Component({
    selector: 'h-nav',
    templateUrl: './header-nav.html',
    styleUrls: ['./header-nav.scss'],
})
export class HeaderNavComponent {
    @Input() data: any
}