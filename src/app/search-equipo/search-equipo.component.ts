import {Component, OnInit,NgModule} from '@angular/core';
import {Equipo} from '../model/equipo';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {EquiposService} from '../services/service.equipo';
import { Location } from '@angular/common';

@Component({
    selector: 'search-equipo',
    templateUrl: './search-equipo.component.html',
    styleUrls: ['./search-equipo.component.css']
})
export class SearchEquipoComponet implements OnInit {

    consulta: string = '';
    equiposList: Equipo[] = [];
    constructor(
    private equiposService: EquiposService,
    private location: Location){
        
    }
    ngOnInit(): void {
       
    }
    buscarEquipo() {
        if (this.consulta) {
          this.equiposService.buscarEquipos(this.consulta).subscribe((equipos) => {
            // Asignamos los equipos recuperados a la propiedad equiposList
            this.equiposList = equipos;
          });
        }
    }
    volverPaginaAnterior() {
        this.location.back(); // Navega hacia atrás en el historial del navegador
    }
}