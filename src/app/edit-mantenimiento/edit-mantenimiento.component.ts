import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { Mantenimiento } from '../model/mantenimiento';
import { Equipo } from '../model/equipo';
import { MantenimientosService } from '../services/service.mantenimiento';


@Component({
    selector: 'edit-mantenimiento',
    templateUrl: './edit-mantenimiento.component.html',
    styleUrls: ['./edit-mantenimiento.component.css']
})
export class EditMantenimientoDialogComponent {

    form:FormGroup;
    mantenimiento:Mantenimiento;
    constructor( 
        private dialogRef:MatDialogRef<EditMantenimientoDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) mantenimiento: Mantenimiento,
        private mantenimientosService : MantenimientosService
    ) {
        
       
        this.mantenimiento = mantenimiento;
       
        this.form = this.fb.group({
            nombre:[mantenimiento.nombre,Validators.required],
            cedula:[mantenimiento.cedula,Validators.required],
            telefono:[mantenimiento.telefono,Validators.required],
            descripcion:[mantenimiento.descripcion,Validators.required],
            fechaInicio:[mantenimiento.fechaInicio,Validators.required],
            fechaFinal:[mantenimiento.fechaFinal,Validators.required]
        })

    }
    close(){
        this.dialogRef.close();
    }
    save(){
        const changes = this.form.value;
        this.mantenimientosService.updateMantenimiento(this.mantenimiento.eid,this.mantenimiento.id,changes)
            .subscribe(()=> {
                this.dialogRef.close(changes);
            });
        }
}