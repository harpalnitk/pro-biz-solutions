import { CoreService } from '../../../core/core.service';

import { Product } from '../../../model/product';

import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";

import { ProductAdminService } from '../admin-product.service';


@Component({
  selector: 'product-qty-dialog',
  templateUrl: './product-qty-dialog.component.html',
  styleUrls: ['./product-qty-dialog.component.scss']
})
export class ProductQtyDialogComponent implements OnInit {

  product: Product;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  add;
  min;
  max;
 



  constructor(
    private dialogRef: MatDialogRef<ProductQtyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private productAdminService: ProductAdminService,
    private coreService: CoreService
  ) {
    this.isLoading$ = this.coreService.getIsLoading();
    
    this.product = data.product;
    this.add = data.add;
  }

  ngOnInit(): void {
    //this.patchForm();
    if(this.add){
      this.min = this.product.count;
      this.max = 100;
    }else{
      this.min = 0;
      this.max = this.product.count;
    }
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      count: new FormControl(this.product.count, { validators: 
        [
          Validators.required,
            Validators.pattern(/^[0-9]+$/),
             Validators.min(this.min ),
            Validators.max(this.max)]}),
    });
  }

  patchForm() {
    this.form.patchValue({
      count: this.product.count,
    });
 
  }


  async save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
 
    console.log("Form Data", data);
    const newCount = await this.productAdminService.runTransaction(this.product.id, data.count);
    // It will update in the parent calling component fro where the dialog was called
    // as reference was passed and we did not
    //Mutate the object here
    if(newCount){
      this.product.count = newCount;
    }
    console.log('newCount', newCount);
    this.dialogRef.close();
}

  close() {
    this.dialogRef.close();
  }

}
