import { Component, Input } from '@angular/core'

@Component({
    selector: 'background',
    templateUrl: './bg.html',
    styleUrls: ['./bg.scss']
})
export class BgComponent{
    @Input() src!: String


    imgLoaded(){}
}