import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Equipo} from "../model/equipo";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { EquiposService } from '../services/service.equipo';


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
            serie:[equipo.serie,Validators.required]
        })

    }
    close(){
        this.dialogRef.close();
    }
    save(){
        const changes = this.form.value;
        this.equiposService.updateEquipo(this.equipo.id,changes)
            .subscribe(()=> {
                this.dialogRef.close(changes);
            });
    }
}






