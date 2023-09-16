import {Component, OnInit,NgModule} from '@angular/core';
import {Equipo} from '../model/equipo';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {EquiposService} from '../services/service.equipo';



@Component({
    selector: 'search-equipo',
    templateUrl: './search-equipo.component.html',
    styleUrls: ['./search-equipo.component.css']
})
export class SearchEquipoComponet implements OnInit {
    consulta: string = '';
    ngOnInit(): void {
       
    }
    buscarEquipo(){

    }

}