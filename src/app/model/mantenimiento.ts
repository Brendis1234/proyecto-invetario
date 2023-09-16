
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
export interface Mantenimiento {
    id: string;
    descripcion: string;
    nombre: string;
    cedula:string;
    telefono:string;
    codigo: number;
    equipoId: number;
    fechaInicio: Timestamp;
    fechaFinal: Timestamp;
    fin:boolean;
    eid:string;
}