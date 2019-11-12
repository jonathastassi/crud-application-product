import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Department } from '../models/department';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly urlApi = 'https://localhost:5001/api/departments';
  
  private departmentsSubjects$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.urlApi)
        .subscribe(this.departmentsSubjects$);
      this.loaded = true;
    }
    return this.departmentsSubjects$.asObservable();
  }

  post(department: Department): Observable<Department> {
    return this.http.post<Department>(this.urlApi, department)
      .pipe(
        tap((dep: Department) => this.departmentsSubjects$.getValue().push(dep))
      );
  }

  delete(department: Department): Observable<any> {
    return this.http.delete(`${this.urlApi}/${department.id}`)
      .pipe(
        tap(
          () => {
            const departments = this.departmentsSubjects$.getValue();
            const i = departments.findIndex(d => d.id === department.id);
            if (i >= 0) {
              departments.splice(i, 1);
            }
          }
        )
      );
  }

  update(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.urlApi}/${department.id}`, department)
      .pipe(
        tap(
          (dep) => {
            const departments = this.departmentsSubjects$.getValue();
            const i = departments.findIndex(d => d.id === dep.id);
            if (i >= 0) {
              departments[i].name = dep.name;
            }
          }
        )
      )
  }
}
