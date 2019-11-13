import { DepartmentService } from './department.service';
import { Product } from './../models/product';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly urlApi = 'https://localhost:5001/api/products';
  
  private productSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded = false;

  constructor(
    private http: HttpClient,
    private departmentService: DepartmentService
  ) { }

  get(): Observable<Product[]> {
    if (!this.loaded) {
      combineLatest(
        this.http.get<Product[]>(this.urlApi),
        this.departmentService.get()
      )
        .pipe(
          tap(
            ([products, departments]) => console.log("123",products, departments)
          ),
          map(
            ([products, departments]) => {
              for (let p of products) {
                let ids = (p.departments as string[]);
                p.departments = ids ? ids.map((id) => departments.find(dep => dep.id == id)) : null;
              }

              return products;
            }
          ),
          tap(
            (products) => console.log(products)
          ),
        )
        .subscribe(this.productSubject$);
      this.loaded = true;
    }

    return this.productSubject$.asObservable();
  }

  post(product: Product): Observable<Product> {
    let departments = (product.departments as Department[]).map(d => d.id);
    return this.http.post<Product>(this.urlApi, {...product, departments})
      .pipe(
        tap(
          p => {
            this.productSubject$.getValue()
              .push({...product, id: p.id})
          }
        )
      ); 
  }

  delete(product: Product): Observable<any> {
    return this.http.delete(`${this.urlApi}/${product.id}`)
      .pipe(
        tap(
          () => {
            let products = this.productSubject$.getValue();
            let i = products.findIndex(p => p.id == product.id);
            if (i >= 0) {
              products.splice(i, 1);
            }
          }
        )
      );
  }

  update(product: Product): Observable<Product> {
    let departments = (product.departments as Department[]).map(d => d.id);
    return this.http.put<Product>(`${this.urlApi}/${product.id}`, {...product, departments})
      .pipe(
        tap(
          (pro) => {
            const products = this.productSubject$.getValue();
            const i = products.findIndex(p => p.id === pro.id);
            if (i >= 0) {
              products[i].name = pro.name;
            }
          }
        )
      )
  }
}
