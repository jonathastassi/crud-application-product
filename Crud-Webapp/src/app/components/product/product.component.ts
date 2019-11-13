import { Subject } from 'rxjs';
import { DepartmentService } from './../../services/department.service';
import { Product } from './../../models/product';
import { ProductService } from './../../services/product.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, NgForm } from '@angular/forms';
import { Department } from 'src/app/models/department';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, OnDestroy {

  constructor(
    private service: ProductService,
    private departmentService: DepartmentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  productForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    stock: ['0', [Validators.required, Validators.min(0)]],
    price: ['0', [Validators.required, Validators.min(0)]],
    departments: [[], Validators.required]
  });

  @ViewChild('form') form: NgForm;

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

  save(): void {
    const model = this.productForm.value;
    if (model.id) {
      this.service.update(model)
        .subscribe(
          (data) => {
            console.log(data);
            this.notify('Updated!');
            this.resetForm();
          },
          (error) => {
            console.error(error);
            this.notify('Error!');
          }
        );
    } else {
      this.service.post(model)
        .subscribe(
          (data) => {
            console.log(data);
            this.notify('Inserted!');
            this.resetForm();
          },
          (error) => {
            console.error(error);
            this.notify('Error!');
          }
        );
    }    
  }

  edit(product: Product): void {
    this.productForm.setValue(product);
  }

  delete(product: Product): void {
    this.service.delete(product)
      .subscribe(
        () => this.notify('Deleted!'),
        (error) => {
          console.error(error);
          this.notify('Error!');          
        }
      );
  }

  notify(message: string): void {
    this.snackBar.open(message, 'OK', {duration: 3000});
  }

  resetForm(): void {
    // this.productForm.reset();
    this.form.resetForm();
  }
}
