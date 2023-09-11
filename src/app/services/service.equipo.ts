import {Injectable} from "@angular/core";
import {AngularFirestore} from "@angular/fire/firestore";
import {from, Observable, of} from "rxjs";
import {Equipo} from "../model/equipo";
import {concatMap, map, tap} from "rxjs/operators";
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
    findMantenimientos(equipoId:string, sortOrder: OrderByDirection = 'asc',
                pageNumber = 0, pageSize = 3): Observable<Mantenimiento[]> {
        return this.db.collection(`equipos/${equipoId}/mantenimientos`,
            ref => ref.orderBy("codigo",sortOrder)
                .limit(pageSize)
                .startAfter(pageNumber * pageSize)
        )
        .get()
        .pipe(
            map(results => convertSnaps<Mantenimiento>(results))
        )
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
    
    createMantenimiento(newMantenimiento: Partial<Mantenimiento>, mantenimientoId?: string, equipoId?: string): Observable<any> {
        // Primero, obtenemos el último mantenimiento
        return this.db.collection("equipos")
          .doc(equipoId)
          .collection("mantenimientos", ref => ref.orderBy("codigo", "desc").limit(1))
          .get()
          .pipe(
            concatMap(result => {
              const mantenimientos = convertSnaps<Mantenimiento>(result);
              const lastMantenimiento = mantenimientos[0];
              const lastMantenimientoCodigo = lastMantenimiento ? lastMantenimiento.codigo : 0;
    
              // Incrementamos el código en 1
              const nuevoCodigo = lastMantenimientoCodigo + 1;
    
              // Agregamos el nuevo mantenimiento con el código actualizado
              return from(
                this.db.collection("equipos")
                  .doc(equipoId)
                  .collection("mantenimientos")
                  .add({ ...newMantenimiento, codigo: nuevoCodigo })
              ).pipe(
                map(res => {
                  return {
                    id: mantenimientoId ?? res.id,
                    codigo: nuevoCodigo, // Nuevo código asignado
                    ...newMantenimiento
                  };
                })
              );
            })
          );
      }
    
    
}
