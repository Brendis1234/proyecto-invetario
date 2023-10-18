import {AfterViewInit, Component, EventEmitter, OnInit, ViewChild,Output, NgModule} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Equipo} from '../model/equipo';
import {catchError, finalize, tap} from 'rxjs/operators';
import {Observable, throwError} from 'rxjs';
import {Mantenimiento} from '../model/mantenimiento';
import { EquiposService } from '../services/service.equipo';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { EditMantenimientoDialogComponent } from '../edit-mantenimiento/edit-mantenimiento.component';
import { MantenimientosService } from '../services/service.mantenimiento';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {
  @Output()
  mantenimientoEdited = new EventEmitter();
  @Output()
  mantenimientoDeleted = new EventEmitter<Mantenimiento>();
  consulta: string = '';
  equipo:Equipo;
  mantenimientos: Mantenimiento[];
  mostrarListarEquipos: boolean = false; // Inicializa la variable mostrarListarEquipos
  mostrarVerMas: boolean = true; // Agrega esta variable y establece su valor inicial en true


  loading = false;
  lastPageLoaded = 0;

  displayedColumns = ['nombre','cedula','telefono','tMantenimiento','descripcion','fechaInicio','fechaFinal','acciones'];
  constructor(private route: ActivatedRoute,
    private mantenimientosService: MantenimientosService,
      private dialog: MatDialog,
      private location: Location) {
      
  }

  ngOnInit() {
    this.equipo = this.route.snapshot.data["equipo"];
    this.loading = true;
    this.mantenimientosService.findMantenimientos(this.equipo.id)
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
    this.mantenimientosService.findMantenimientos(this.equipo.id,"asc",
    this.lastPageLoaded)
    .pipe(
      finalize(()=>this.loading=false)
    )
    .subscribe(mantenimientos => this.mantenimientos=this.mantenimientos.concat(mantenimientos))
  }
  editMantenimineto(mantenimiento:Mantenimiento) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.minWidth = "400px";
    dialogConfig.data = mantenimiento;
    
    this.dialog.open(EditMantenimientoDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe(val => {
          if (val) {
            this.mantenimientoEdited.emit();
            this.mantenimientosService.findMantenimientos2(this.equipo.id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        equipos => {
          // Actualiza la lista de equipos sin borrar el equipo actual
          this.mantenimientos = [];
          this.mantenimientosService.findMantenimientos(this.equipo.id)
            .subscribe(
              mantenimientos => this.mantenimientos = mantenimientos
            );
        }
      );
          }
      }
    );
  }
  confirmDelete(equipo:Equipo,mantenimiento:Mantenimiento) {
    Swal.fire({
      title: '¿Estás seguro de Eliminar?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value) {
        this.onDeleteMantenimiento(equipo,mantenimiento);
      }
    });
}
  onDeleteMantenimiento(equipo:Equipo,mantenimiento:Mantenimiento){
    this.mantenimientosService.deleteMantenimiento(equipo.id,mantenimiento.id)
      .pipe(
        tap(() => {
            console.log("deleted equipo", mantenimiento);
            this.mantenimientoDeleted.emit(mantenimiento);
            Swal.fire('Equipo Eliminado', `Serie: ${equipo.serie}`, 'success');
            window.location.reload();
        }),
        catchError(err => {
            console.log(err);
            alert("no se pudo eliminar");
            return throwError(err);
        })
      )
      .subscribe();
  }
  buscarMantenimiento(equipo:Equipo) {
    this.mantenimientosService
    .buscarMantenimientos(this.equipo.id, this.consulta)
    .subscribe((mantenimientos) => {
      if (mantenimientos.length > 0) {
        // Si se encontraron mantenimientos, puedes acceder al primer mantenimiento en la lista
        const mantenimientoEncontrado = mantenimientos[0];
        console.log('Mantenimiento encontrado:', mantenimientoEncontrado);
        this.mantenimientos = mantenimientos;
      } else {
        // No se encontraron mantenimientos con ese nombre
        console.log('No se encontraron mantenimientos con ese nombre.');
      }
    });
    this.consulta = '';
    this.mostrarListarEquipos = true;
    this.mostrarVerMas = false;
  }
  listarTodosEquipos() {
    this.loading = true;
  
    // Realiza la llamada al servicio para obtener todos los equipos
    this.mantenimientosService.findMantenimientos2(this.equipo.id)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe(
        equipos => {
          // Actualiza la lista de equipos sin borrar el equipo actual
          this.mantenimientos = [];
          this.mantenimientosService.findMantenimientos(this.equipo.id)
            .subscribe(
              mantenimientos => this.mantenimientos = mantenimientos
            );
        }
      );
      this.mostrarListarEquipos = false;
      this.mostrarVerMas = true;
  }
  
  volverPaginaAnterior() {
    this.location.back(); // Navega hacia atrás en el historial del navegador
  }
}
