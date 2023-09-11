import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {catchError, concatMap, last, map, take, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import { EquiposService } from '../services/service.equipo';
import { Mantenimiento } from '../model/mantenimiento';
import { Equipo } from '../model/equipo';

@Component({
  selector: 'create-mantenimiento',
  templateUrl: 'create-mantenimiento.component.html',
  styleUrls: ['create-mantenimiento.component.css']
})
export class CreateMantenimientoComponent implements OnInit {
  mantenimientoId:string;
  equipo:Equipo;
  form = this.fb.group({
    nombre:['', Validators.required],
    cedula:['', Validators.required],
    telefono:['',Validators.required],
    descripcion:['',Validators.required]
  });
  constructor(private fb:FormBuilder,
    private equipoService:EquiposService,
    private afs: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private storage: AngularFireStorage) {
    
  }

  ngOnInit() {
    this.mantenimientoId = this.afs.createId();
    this.equipo = this.route.snapshot.data["equipo"];
}

onCreateMantenimiento(){
    const val = this.form.value;

        const newMantenimiento: Partial<Mantenimiento> = {
            nombre: val.nombre,
            cedula: val.cedula,
            telefono:val.telefono,
            descripcion:val.descripcion,
            //fechaInicio: val.fechaInicio,
            //equipoId:val.this.equipo.codigo
        };

        this.equipoService.createMantenimiento(newMantenimiento, this.mantenimientoId,this.equipo.id)
            .pipe(
                tap(mantenimiento => {
                    console.log("Registro exitoso: ", mantenimiento);
                    this.router.navigateByUrl("/mantenimiento");
                }),
                catchError(err => {
                    console.log(err);
                    alert("no se realizo registro.");
                    return throwError(err);
                })
            )
            .subscribe();
  }
    

}
