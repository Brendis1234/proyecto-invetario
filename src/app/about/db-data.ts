export const EQUIPOS: any = {
  1: {
    id:1,
    sO:'Windows 10',
    tipoConRed:"inalambrica",
    modelo:'Notebook',
    codigo: 0,
    tipoDispositivo:'computador de escritorio',
    descripcion:'dispositivo en perfecto estado',
    estado:'nuevo',
    categoria: ['Universidad'],
    serie:'u1',
    sala:2
  },


  2: {
    id: 2,
    sO:'Windows 11',
    tipoConRed:"inalambrica",
    modelo:'Notebook',
    codigo: 1,
    tipoDispositivo:'impresora',
    descripcion:'dispositivo en perfecto estado',
    estado:'nuevo',
    categoria: ['Universidad'],
    serie:'u2',
    sala:1
  },



  3: {
    id: 3,
    sO:'Windows 10',
    tipoConRed:"inalambrica",
    modelo:'Notebook',
    codigo: 2,
    tipoDispositivo:'computador de escritorio',
    descripcion:'dispositivo en perfecto estado',
    estado:'nuevo',
    categoria: ['Colegio'],
    serie:'c1',
    sala:2
  },

  4: {
    id: 4,
    sO:'Windows 10',
    tipoConRed:"inalambrica",
    modelo:'Notebook',
    codigo: 3,
    tipoDispositivo:'impresora',
    descripcion:'dispositivo en perfecto estado',
    estado:'nuevo',
    categoria: ['Colegio'],
    serie:'c2',
    sala:2
  }

};

export const MANTENIMIENTOS = {
  1: {
    id: 1,
    'descripcion': 'fallo en el monitor',
    'nombre': 'Brenda Largo',
    'cedula': '1000159817',
    'telefono': '3142774962',
    'codigo': 1,
    equipoId: 1 
  },
  2: {
    id: 2,
    'descripcion': 'fallo en teclado',
    'nombre': 'Brenda Largo',
    'cedula': '1000159817',
    'telefono': '3142774962',
    'codigo': 2,
    equipoId: 1 
  },
  3: {
    id: 3,
    'descripcion': 'fallo en el maus',
    'nombre': 'Harol largo',
    'cedula': '1000159817',
    'telefono': '3142774962',
    'codigo': 3,
    equipoId: 3 
  },


};


export const USERS = {
  1: {
    id: 1,
    email: 'test@angular-university.io',
    password: 'test',
    pictureUrl: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png'
  }

};


export function findCourseById(equipoId: number) {
  return EQUIPOS[equipoId];
}

export function findLessonsForCourse(equipoId: number) {
  return Object.values(MANTENIMIENTOS).filter(mantenimiento => mantenimiento.equipoId == equipoId);
}

export function authenticate(email: string, password: string) {

  const user: any = Object.values(USERS).find(user => user.email === email);

  if (user && user.password == password) {
    return user;
  } else {
    return undefined;
  }

}
