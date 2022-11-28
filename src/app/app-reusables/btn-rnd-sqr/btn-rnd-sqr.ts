import { Component, Input } from '@angular/core'

@Component({
    selector: 'btn-rs',
    templateUrl: './btn-rnd-sqr.html',
    styleUrls: ['./btn-rnd-sqr.scss']
})
export class ButtonRSComponent {
    @Input() options: any = {}
}