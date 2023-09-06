import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Equipo} from '../model/equipo';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Mantenimiento} from '../model/mantenimiento';


@Component({
  selector: 'equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css']
})
export class CourseComponent implements OnInit {

  loading = false;

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {

  }

}
