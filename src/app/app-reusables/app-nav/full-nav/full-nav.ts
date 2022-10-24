import { Component, EventEmitter, Input, SimpleChange } from "@angular/core";


@Component({
    selector: 'f-nav',
    templateUrl: './full-nav.html',
    styleUrls: ['./full-nav.scss'],
    outputs: ['clickEvent']
})
export class FullNavComponent {
    @Input() data:any
    clickEvent = new EventEmitter


    ngOnInit() { }
    
    public catSelect(){
        if(document.querySelector(`#messages`)){
            document.querySelector(`#messages`)!.id = ''
        }
        const active:any = document.querySelector(`#popup [identity="${this.data.messages.activeId}"]`)
        active.id = 'messages'
    }
    emitEvent(e: any) {
        this.clickEvent.emit(e)
    }
}