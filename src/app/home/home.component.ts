import {Component, OnInit} from '@angular/core';
import {Equipo} from '../model/equipo';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {Router} from '@angular/router';
import {EquiposService} from '../services/service.equipo';



@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    universidadEquiposS2$: Observable<Equipo[]>;
    universidadEquiposS1$: Observable<Equipo[]>;
    colegioEquipos$: Observable<Equipo[]>;
    casaCEquipos$: Observable<Equipo[]>;
    mostrarAmbasSalas: boolean = true; // Mostrar ambas salas inicialmente

    mostrarSala1: boolean = true;
    mostrarSala2: boolean = true;

  toggleSala(sala: number) {
    // Reiniciar las variables de visibilidad
    this.mostrarSala1 = false;
    this.mostrarSala2 = false;

    // Establecer la sala seleccionada
    if (sala === 1) {
      this.mostrarSala1 = true;
    } else if (sala === 2) {
      this.mostrarSala2 = true;
    }
  }

    constructor(
      private router: Router,
      private equiposService: EquiposService
      ) {

    }

    ngOnInit() {
        this.reloadEquipos();
    }
    reloadEquipos(){
        this.universidadEquiposS1$ = this.equiposService.loadEquiposByCategory("Universidad",1);
        this.universidadEquiposS2$ = this.equiposService.loadEquiposByCategory("Universidad",2);
        this.colegioEquipos$ = this.equiposService.loadEquiposByCategory("Colegio",2);
        this.casaCEquipos$ = this.equiposService.loadEquiposByCategory("CasaC",3);
    }
    
}
/*<mat-tab label="Universidad">
  <button [disabled]="mostrarEquipos2" (click)="mostrarEquipos1 = true; mostrarEquipos2 = false">Sala 1</button>
  <div *ngIf="mostrarEquipos1">
    <equipos-card-list [equipos]="universidadEquiposS1$ | async" (equipoEdited)="reloadEquipos()"></equipos-card-list>
  </div>
  <button [disabled]="mostrarEquipos1" (click)="mostrarEquipos2 = true; mostrarEquipos1 = false">Sala 2</button>
  <div *ngIf="mostrarEquipos2">
    <equipos-card-list [equipos]="universidadEquiposS2$ | async" (equipoEdited)="reloadEquipos()"></equipos-card-list>
  </div>
</mat-tab> */
