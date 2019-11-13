import { Subject } from 'rxjs';
import { DepartmentService } from './../../services/department.service';
import { Product } from './../../models/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Department } from 'src/app/models/department';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(
    private service: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder
  ) { }

  productForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    stock: ['0', [Validators.required, Validators.min(0)]],
    price: ['0', [Validators.required, Validators.min(0)]],
    departments: [[], Validators.required]
  });

  products: Product[] = [];
  departments: Department[] = [];

  private unsubscribe$: Subject<any> = new Subject<any>();

  ngOnInit() {
    this.getProducts();
    this.getDepartments();
  }

  getDepartments(): void {
    this.departmentService.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => this.departments = data);
  }

  getProducts(): void {
    this.service.get()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => this.products = data);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }
}
