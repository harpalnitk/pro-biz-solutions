import { CoreService } from '../../../core/core.service';
import { ProductAdminService } from '../product-admin.service';

import { Product } from '../../../model/product';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
import { ProductConfigService, SelectValues } from '../product-config/product-config.service';



@Component({
  selector: "product-dialog",
  templateUrl: "./product-dialog.component.html",
  styleUrls: ["./product-dialog.component.scss"],
})
export class ProductDialogComponent implements OnInit, AfterViewInit {
  product: Product;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  editMode = false;

  selectedType: string;
  selectedMake: string;

  types$ : Observable<SelectValues[]>;
  subTypes$: Observable<SelectValues[]> = this.productConfigService.subTypesForTypeSorted$.pipe(
    tap(val=> console.log('Sub Types received', val))
  );
  makes$: Observable<SelectValues[]>;

  constructor(
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) product: Product,
    private productAdminService: ProductAdminService,
    private productConfigService: ProductConfigService,
    private router: Router,
    private coreService: CoreService,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
    this.product = product;
    this.isLoading$ = this.coreService.getIsLoading();
    this.makes$ = this.productConfigService.allMakesSorted$;
    this.types$ = this.productConfigService.allTypesSorted$;
    // this.subTypes$ = this.productConfigService.subTypesForTypeSorted$.pipe(
    //   tap(val=> console.log('Sub Types received', val))
    // );
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    if (this.product) {
      this.editMode = true;
      this.patchForm();
    }
    this.cdRef.detectChanges(); 
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      type: new FormControl(null, { validators: [Validators.required] }),
      subType: new FormControl(null, { validators: [Validators.required] }),
      make: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  patchForm() {
    this.loadSubType(this.product.type);
    this.form.patchValue({
      name: this.product.name,
      type: this.product.type,
      subType: this.product.subType,
      make: this.product.make,
    });
   
  }

  loadSubType(type: string){
    console.log('loadSubType called', type);
    this.productConfigService.selectedTypeChanged(type);
  }



  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    console.log("Form Data", data);
    this.coreService.setIsLoading(true);
    if (this.product) {
      //EDIT PRODUCT
      this.productAdminService
        .updateProduct(this.product.id, data)
        .pipe(
          finalize(() => {
            this.dialogRef.close('edit');
            this.coreService.setIsLoading(false);
           
          })
        )
        .subscribe(
          (res) => {
            this.productAdminService.addEventToItemHistory(this.product.id,'PRODUCT EDITED','NA');
            this.coreService.presentSnackbar("Product updated successfully!");
          },
          (err) => {
            console.log("Error in updating product", err);
            this.coreService.setMessage(
              "Error in adding product. Please try again!"
            );
          }
        );
    } else {
      //ADD PRODUCT
      this.productAdminService
        .addProduct(data.name, data.type, data.subType, data.make)
        .pipe(
          finalize(() => {
            console.log(" in add product before closing dialog");
            this.dialogRef.close();
            this.coreService.setIsLoading(false);
          })
        )
        .subscribe(
          (res) => {
            console.log("Response in add product", res);
            this.coreService.presentSnackbar("Product added successfully!");
          },
          (err) => {
            console.log("Error in adding product", err);
            this.coreService.presentSnackbar(
              "Error in adding product. Please try again!"
            );
          }
        );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
