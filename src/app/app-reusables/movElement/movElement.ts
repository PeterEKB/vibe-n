import { Component, EventEmitter, Injectable, Input, Output, SimpleChanges } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { TMDBService } from "src/app/app-services/tmdb-api";

@Component({
    selector: 'mov-ele',
    templateUrl: './movElement.html',
    styleUrls: ['./movElement.scss'],
    providers: [HttpClient, TMDBService],
    outputs: ['loadComplete']
})
export class MovieElementComponent {
    element: any = {
        actual: {
            display: false
        }
    }
    
    @Input()
    data: any

    loadComplete = new EventEmitter


    get loaded() {
        this.element.actual.display = true;
        this.loadComplete.emit(true)
        return true
    }
}