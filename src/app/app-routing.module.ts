import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {AboutComponent} from './about/about.component';
import {MantenimientoComponent} from './mantenimiento/mantenimiento.component';
import {LoginComponent} from './login/login.component';
import {CreateEquipoComponent} from './create-equipo/create-equipo.component';
import {CreateMantenimientoComponent} from './create-mantenimiento/create-mantenimiento.component';
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {CreateUserComponent} from './create-user/create-user.component';
import { EquipoResolver } from './services/equipo.resolver';
import { SearchEquipoComponet } from './search-equipo/search-equipo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'create-equipo',
    component: CreateEquipoComponent

  },
  {
    path: 'create-mantenimiento',
    component: CreateMantenimientoComponent
  },
  {
    path: 'search-equipo',
    component: SearchEquipoComponet
  },
  {
    path: 'mantenimiento/:equipoUrl',
    component: CreateMantenimientoComponent,
    resolve:{
      equipo:EquipoResolver
    }

  },
  {
    path: 'create-user',
    component: CreateUserComponent

  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'equipos/:equipoUrl',
    component: MantenimientoComponent,
    resolve:{
      equipo:EquipoResolver
    }
  },
  {
    path: '**',
    redirectTo: '/'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
