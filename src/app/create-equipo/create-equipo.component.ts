import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Equipo} from '../model/equipo';
import {catchError, concatMap, last, map, take, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import { EquiposService } from '../services/service.equipo';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
@Component({
  selector: 'create-equipo',
  templateUrl: 'create-equipo.component.html',
  styleUrls: ['create-equipo.component.css']
})
export class CreateEquipoComponent implements OnInit {
  equipoId:string;

  form = this.fb.group({
    descripcion:['', Validators.required],
    tipoDispositivo:['', Validators.required],
    sO:['',Validators.required],
    estado:['',Validators.required],
    tipoConRed:['',Validators.required],
    modelo:['',Validators.required],
    categoria:['',Validators.required],
    serie:['',Validators.required],
    sala:['',Validators.required]
  });
  constructor(private fb:FormBuilder,
    private equipoService:EquiposService,
    private afs: AngularFirestore,
    private router: Router,
    private storage: AngularFireStorage,
    private location:Location) {
  }

  ngOnInit() {
    this.equipoId = this.afs.createId();
}

  onCreateEquipo(){
    const val = this.form.value;
        const newEquipo: Partial<Equipo> = {
            descripcion: val.descripcion,
            estado: val.estado,
            modelo:val.modelo,
            sO:val.sO,
            tipoDispositivo: val.tipoDispositivo,
            tipoConRed: val.tipoConRed,
            categoria: [val.categoria],
            serie:val.serie,
            sala:val.sala
        };

        this.equipoService.createEquipo(newEquipo, this.equipoId)
            .pipe(
                tap(equipo => {
                    console.log("Registro exitoso: ", equipo);
                    this.router.navigateByUrl("/equipos");
                    Swal.fire('Equipo Registrado correctamente', `Serie: ${equipo.serie}`, 'success');
                }),
                catchError(err => {
                    console.log(err);
                    alert("no se realizo registro.");
                    return throwError(err);
                })
            )
            .subscribe();
  }
  volverPaginaAnterior() {
    this.location.back(); // Navega hacia atrás en el historial del navegador
}
    

}
