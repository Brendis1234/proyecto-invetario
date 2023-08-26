import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Equipo} from "../model/equipo";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditEquipoDialogComponent} from "../edit-equipo-dialog/edit-equipo-dialog.component";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';

@Component({
    selector: 'equipos-card-list',
    templateUrl: './equipos-card-list.component.html',
    styleUrls: ['./equipos-card-list.component.css']
})
export class EquiposCardListComponent implements OnInit {

    @Input()
    equipos: Equipo[];

    @Output()
    equipoEdited = new EventEmitter();

    @Output()
    equipoDeleted = new EventEmitter<Equipo>();

    constructor(
      private dialog: MatDialog,
      private router: Router) {
    }

    ngOnInit() {

    }

    editCourse(equipo:Equipo) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";

        dialogConfig.data = equipo;

        this.dialog.open(EditEquipoDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                if (val) {
                    this.equipoEdited.emit();
                }
            });

    }

}








