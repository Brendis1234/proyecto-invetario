import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Equipo} from "../model/equipo";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { EquiposService } from '../services/service.equipo';

import Swal from 'sweetalert2';
@Component({
    selector: 'edit-equipo-dialog',
    templateUrl: './edit-equipo-dialog.component.html',
    styleUrls: ['./edit-equipo-dialog.component.css']
})
export class EditEquipoDialogComponent {
    form:FormGroup;
    equipo:Equipo;
    constructor( 
        private dialogRef:MatDialogRef<EditEquipoDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) equipo: Equipo,
        private equiposService : EquiposService
    ) {
        this.equipo = equipo;
        this.form = this.fb.group({
            modelo:[equipo.modelo,Validators.required],
            descripcion:[equipo.descripcion,Validators.required],
            estado:[equipo.estado,Validators.required],
            tipoDispositivo:[equipo.tipoDispositivo,Validators.required],
            tipoConRed:[equipo.tipoConRed,Validators.required],
            serie:[equipo.serie,Validators.required],
            sala:[equipo.sala,Validators.required]
        })

    }
    close(){
        this.dialogRef.close();
    }
    save() {
        const changes = this.form.value;
        this.equiposService.updateEquipo(this.equipo.id, changes)
          .subscribe(() => {
            // La edición fue exitosa, muestra un cuadro de diálogo SweetAlert
            Swal.fire('Equipo actualizado', `Serie: ${this.equipo.serie}`, 'success');
        this.dialogRef.close(changes);
          }, error => {
            //  manejar errores si la edición falla
            console.error('Error al actualizar:', error);
            // Muestra un cuadro de diálogo SweetAlert de error si es necesario
            Swal.fire('Error al actualizar', 'Ha ocurrido un error al actualizar el registro', 'error');
          });
      }
    confirmSave() {
        Swal.fire({
          title: '¿Estás seguro de editar?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, editar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {
            this.save();
          }
        });
      }
}






