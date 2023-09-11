import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Equipo} from '../model/equipo';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Mantenimiento} from '../model/mantenimiento';
import { EquiposService } from '../services/service.equipo';


@Component({
  selector: 'equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class EquipoComponent implements OnInit {
  equipo:Equipo;
  mantenimientos: Mantenimiento[];

  loading = false;
  lastPageLoaded = 0;

  displayedColumns = ['nombre','cedula','telefono','descripcion','fechaInicio','fechaFinal','acciones'];

  constructor(private route: ActivatedRoute,
    private equiposService: EquiposService) {

  }

  ngOnInit() {
    this.equipo = this.route.snapshot.data["equipo"];
    this.loading = true;
    this.equiposService.findMantenimientos(this.equipo.id)
    .pipe(
      finalize(()=> this.loading = false)
    )
    .subscribe(
      mantenimientos => this.mantenimientos = mantenimientos
    );
  }
  loadMore(){

    this.lastPageLoaded++;

    this.loading= true;

    this.equiposService.findMantenimientos(this.equipo.id,"asc",
    this.lastPageLoaded)
    .pipe(
      finalize(()=>this.loading=false)
    )
    .subscribe(mantenimientos => this.mantenimientos=this.mantenimientos.concat(mantenimientos))
  }
  editMantenimiento(equipo:Equipo){

  }
  onDeleteMantenimiento(equipo:Equipo){

  }

}
