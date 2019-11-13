import { DepartmentService } from './../../services/department.service';
import { Department } from './../../models/department';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.css']
})
export class DepartmentComponent implements OnInit, OnDestroy {

  deparmentName: string;
  departments: Department[];
  private unsubscribe$: Subject<any> = new Subject();
  departmentEdit: Department = null;

  constructor(
    private service: DepartmentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getDepartments();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
  }

  getDepartments(): void {
    this.service.get()
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(
        (data) => {
          this.departments = data;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  save(): void {
    if (this.departmentEdit) {
      this.service.update({ name: this.deparmentName, id: this.departmentEdit.id })
        .subscribe(
          (data) => {
            console.log(data);
            this.notify('Updated!');
            this.clearFields();
          },
          (error) => {
            console.error(error);
            this.notify('Error!');
          }
        );
    } else {
      this.service.post({ name: this.deparmentName })
        .subscribe(
          (data) => {
            console.log(data);
            this.notify('Inserted!');
            this.clearFields();
          },
          (error) => {
            console.error(error);
            this.notify('Error!');
          }
        );
    }
  }

  cancel(): void {
    this.clearFields();
  }

  clearFields(): void {
    this.deparmentName = '';
    this.departmentEdit = null;
  }

  edit(department: Department): void {
    this.departmentEdit = department;
    this.deparmentName = this.departmentEdit.name;
  }

  delete(department: Department): void {
    this.service.delete(department)
      .subscribe(
        () => this.notify('Removed'),
        (err) => console.log(err)
      );
  }

  notify(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

}
