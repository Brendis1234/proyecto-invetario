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

    universidadEquipos$: Observable<Equipo[]>;
    colegioEquipos$: Observable<Equipo[]>;
    casaCEquipos$: Observable<Equipo[]>;

    constructor(
      private router: Router,
      private equiposService: EquiposService
      ) {

    }

    ngOnInit() {
        this.reloadEquipos();
    }
    reloadEquipos(){
        this.universidadEquipos$ = this.equiposService.loadEquiposByCategory("Universidad");
        this.colegioEquipos$ = this.equiposService.loadEquiposByCategory("Colegio");
        this.casaCEquipos$ = this.equiposService.loadEquiposByCategory("CasaC");
    }

}
