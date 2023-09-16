import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {from, Observable, of, throwError} from "rxjs";
import {Equipo} from "../model/equipo";
import {concatMap, map, switchMap, tap} from "rxjs/operators";
import {convertSnaps} from "./db-utils";
import {Mantenimiento} from "../model/mantenimiento";

import firebase from "firebase";
import OrderByDirection = firebase.firestore.OrderByDirection;

@Injectable({
    providedIn: "root"
})
export class EquiposService{
    constructor(private db:AngularFirestore){

    }

    findEquipoByUrl(equipoUrl: string): Observable<Equipo | null> {
        let codigo = parseInt(equipoUrl);
        return this.db.collection("equipos",
            ref => ref.where("codigo", "==", codigo))
            .get()
            .pipe(
              map(results => {

                  const equipos = convertSnaps<Equipo>(results);

                  return equipos.length == 1 ? equipos[0] : null;
              })
            );
    }
    /*findEquipoByCodigo(codigo: number): Observable<{ id: string, equipo: Equipo } | null> {
        return this.db.collection("equipos",
            ref => ref.where("codigo", "==", codigo))
            .get()
            .pipe(
                map(snapshot => {
                    const equipos = convertSnaps<Equipo>(snapshot);
                    if (equipos.length === 1) {
                        const id = snapshot.docs[0].id;
                        return { id, equipo: equipos[0] };
                    } else {
                        return null;
                    }
                })
            );
    }*/
    deleteCourseAndLessons(equipoId:string) {
        return this.db.collection(`equipos/${equipoId}/mantenimiento`)
            .get()
            .pipe(
                concatMap(results => {

                    const mantenimientos = convertSnaps<Mantenimiento>(results);

                    const batch = this.db.firestore.batch();

                    const equipoRef = this.db.doc(`equipos/${equipoId}`).ref;

                    batch.delete(equipoRef);

                    for (let mantenimiento of mantenimientos) {
                        const mantenimientoRef =
                            this.db.doc(`equipos/${equipoId}/mantenimiento/${mantenimiento.id}`).ref;

                        batch.delete(mantenimientoRef);
                    }

                    return from(batch.commit());

                })
            );
    }
    deleteEquipo(equipoId:string) {
        return from(this.db.doc(`equipos/${equipoId}`).delete());
    }
    updateEquipo(equipoId:string, changes: Partial<Equipo>):Observable<any> {
        return from(this.db.doc(`equipos/${equipoId}`).update(changes));
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

    loadEquiposByCategory(categoria:string,sala: number): Observable<Equipo[]>{
        return this.db.collection(
            "equipos",
            ref => ref.where("categoria","array-contains", categoria)//array contains tipo especil de consulta que nos permkite apuntar al contenido de una matriz
                .where("sala", "==", sala)
                .orderBy("codigo")
            )
            .get()
            .pipe(
                map(result => convertSnaps<Equipo>(result))
            );
    }
    buscarEquipos( nombre: string): Observable<any[]> {
        const equiposRef = this.db.collection(`equipos`, (ref) =>
          ref.where('serie', '==', nombre)
        );
        return equiposRef.snapshotChanges().pipe(
          map((snapshots) => {
            return snapshots.map((snapshot) => {
              const id = snapshot.payload.doc.id;
              const data = snapshot.payload.doc.data();
              const mergedData = Object.assign({ id }, data);
              return mergedData;
            });
          })
        );
      }
}
