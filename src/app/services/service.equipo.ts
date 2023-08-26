import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {from, Observable, of} from "rxjs";
import {Equipo} from "../model/equipo";
import {concatMap, map, tap} from "rxjs/operators";
import {convertSnaps} from "./db-utils";
import {Lesson} from "../model/lesson";

import firebase from "firebase";
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
    providedIn: "root"
})
export class EquiposService{
    constructor(private db:AngularFirestore){

    }

    createEquipo(newEquipo: Partial<Equipo>, equipoId?:string) {
        return this.db.collection("equipos",
                ref => ref.orderBy("codigo", "desc").limit(1))
            .get()
            .pipe(
                concatMap(result => {

                    const equipos = convertSnaps<Equipo>(result);

                    const lastEquipoCodigo = equipos[0]?.codigo ?? 0;

                    const equipo = {
                        ...newEquipo,
                        codigo: lastEquipoCodigo + 1
                    }

                    let save$: Observable<any>;

                    if (equipoId) {
                        save$ = from(this.db.doc(`equipos/${equipoId}`).set(equipo));
                    }
                    else {
                        save$ = from(this.db.collection("equipos").add(equipo));
                    }

                    return save$
                        .pipe(
                            map(res => {
                                return {
                                    id: equipoId ?? res.id,
                                    ...equipo
                                }
                            })
                        );


                })
            )
    }

    loadEquiposByCategory(categoria:string): Observable<Equipo[]>{
        return this.db.collection(
            "equipos",
            ref => ref.where("categoria","array-contains", categoria)//array contains tipo especil de consulta que nos permkite apuntar al contenido de una matriz
                .orderBy("codigo")
            )
            .get()
            .pipe(
                map(result => convertSnaps<Equipo>(result))
            );
    }
}