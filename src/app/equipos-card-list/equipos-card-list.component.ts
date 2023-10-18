import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Equipo} from "../model/equipo";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditEquipoDialogComponent} from "../edit-equipo-dialog/edit-equipo-dialog.component";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import { EquiposService } from '../services/service.equipo';
import Swal from 'sweetalert2';

@Component({
    selector: 'equipos-card-list',
    templateUrl: './equipos-card-list.component.html',
    styleUrls: ['./equipos-card-list.component.css']
})
export class EquiposCardListComponent implements OnInit {

    @Input()
    equipos: Equipo[];

    @Output()
    equipoEdited = new EventEmitter();

    @Output()
    equipoDeleted = new EventEmitter<Equipo>();

    constructor(
      private dialog: MatDialog,
      private router: Router,
      private equiposService:EquiposService) {
    }

    ngOnInit() {

    }

    editEquipo(equipo:Equipo) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";
        dialogConfig.data = equipo;

        this.dialog.open(EditEquipoDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                if (val) {
                    this.equipoEdited.emit();
                }
            });

    }
    confirmDelete(equipo:Equipo) {
        Swal.fire({
          title: '¿Estás seguro de Eliminar?',
          text: 'Esta acción no se puede deshacer.',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.onDeleteEquipo(equipo);
          }
        });
    }
    onDeleteEquipo(equipo:Equipo){
        this.equiposService.deleteCourseAndLessons(equipo.id)
            .pipe(
                tap(() => {
                    console.log("deleted equipo", equipo);
                    this.equipoDeleted.emit(equipo);
                    Swal.fire('Equipo Eliminado', `Serie: ${equipo.serie}`, 'success');
                }),
                catchError(err => {
                    console.log(err);
                    Swal.fire('Error al actualizar', 'Ha ocurrido un error al actualizar el registro', 'error');
                    return throwError(err);
                })
            )
            .subscribe();
    }


}








