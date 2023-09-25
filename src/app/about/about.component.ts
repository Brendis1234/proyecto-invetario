import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {EQUIPOS} from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    constructor(private db: AngularFirestore) {
    }

    async uploadData() {
        const equiposCollection = this.db.collection('equipos');
        const equipos = await this.db.collection('equipos').get();
        for (let equipo of Object.values(EQUIPOS)) {
            const newEquipo = this.removeId(equipo);
            const equipoRef = await equiposCollection.add(newEquipo);
            const mant = await equipoRef.collection('mantenimientos');
            console.log(`Uploading equipo ${equipo['descripcion']}`);
  
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }
    onReadDoc(){//tiempo real pero usando valueChanges
        this.db.doc("/equipos/jajFuTSu3CcQc7L0XtDA")
        .valueChanges()//no estamos reciniendo una instancea como en los casos anteriores sino que recibomos los datos en si 
        .subscribe(equipo => {
            console.log(equipo);//muestra los datos sin su identificador
        });
    }
    onReadCollection(){//consulta que apunta a dos capos dentro de la misa coleccion recordar crear indices 
        this.db.collection(
            "equipos",
            ref => ref.where("codigo","<=",20)//no se puede crear una consulta con dos campos del mismo tipo 
            .where("estado","==","dañado")    
            .orderBy("codigo"))
        .get()
            .subscribe(snaps => {
                snaps.forEach(snap => {
                    console.log(snap.id);
                    console.log(snap.data());
                })
            });

    }
    onReadCollectionGroup() {

        this.db.collectionGroup("mantenimiento",
            ref => ref.where("codigo", "==", 1))
            .get()
            .subscribe(snaps => {

                snaps.forEach(snap => {

                    console.log(snap.id);
                    console.log(snap.data());

                })

            });

    }


}
















