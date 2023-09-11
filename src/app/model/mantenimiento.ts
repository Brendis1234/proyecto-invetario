
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
export interface Mantenimiento {
    id: number;
    descripcion: string;
    nombre: string;
    cedula:string;
    telefono:string;
    codigo: number;
    equipoId: number;
    terminado:boolean;
    fechaInicio: Timestamp;
    fechaFinal: Timestamp;
}