import { Component, ElementRef, EventEmitter, Input, ViewChild } from "@angular/core";

@Component({
    selector: 'inp',
    templateUrl: './input-full.html',
    styleUrls: ['./input-full.scss'],
    outputs: ['inputEvent']
})
export class InputFull {
    @ViewChild('inp') input!: ElementRef;
    @Input()
    public set attr(attr: any) {
        this.#_attr = attr
    }
    get attr() {
        //Tracks input changes not involving focus/blur (ngOnChange doesn't track this)
        if (this.#_attr.value === '') {
            this.active = ''
        } else if (this.#_attr.value !== this.#_old_value) {
            this.active = 'active'
            setTimeout(()=>{this.emitEvent({value: this.#_attr})},500)
            this.#_old_value = this.#_attr.value
        }
        
        return this.#_attr
    }

    inputEvent = new EventEmitter
    #_old_value!:string
    #_attr!: any
    active = ''

    ngAfterViewInit() {
        const tmp = Object.entries(this.attr)
        for (const [key, val] of tmp) {
            if (key === 'placeholder')
                continue
            this.input.nativeElement[key] = val
        };
    }

    onBlur() {
        if (this.#_attr.value.match(/([^ \n])+$/)) {
            this.active = 'active'
        } else {
            this.active = ''
            this.input.nativeElement.value = ''
        }
    }
    emitEvent(e: any) {
        e.value = this.input.nativeElement.value
        this.inputEvent.emit(e)
    }
}