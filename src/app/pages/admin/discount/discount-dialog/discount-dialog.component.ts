import { CoreService } from '../../../../core/core.service';
import { AdminDiscountService } from '../admin-discount.service';

import { Discount } from '../../../../model/discount';
import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { finalize, tap } from "rxjs/operators";
//import { ProductConfigService, SelectValues } from '../product-config/product-config.service';



@Component({
  selector: "discount-dialog",
  templateUrl: "./discount-dialog.component.html",
  styleUrls: ["./discount-dialog.component.scss"],
})
export class DiscountDialogComponent implements OnInit, AfterViewInit {
  discount: Discount;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  editMode = false;


  constructor(
    private dialogRef: MatDialogRef<DiscountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) discount: Discount,
    private adminDiscountService: AdminDiscountService,
    private router: Router,
    private coreService: CoreService,
    private cdRef: ChangeDetectorRef
  ) {
    this.initForm();
    console.log('injected discount in discount dialog component',discount)
    this.discount = discount;
    this.isLoading$ = this.coreService.getIsLoading();
  }

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    if (this.discount) {
      this.editMode = true;
      this.patchForm();
    }
    console.log('before detectchanges');
    this.cdRef.detectChanges(); 
  }

  initForm() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      desc: new FormControl(null),
      value: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  patchForm() {
    console.log("patchForm in discount dialog component" );
   // this.loadSubType(this.product.type);
    this.form.patchValue({
      name: this.discount.name,
      desc: this.discount.desc,
      value: this.discount.value,
    });
   
  }




  save() {
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
  //  console.log("Form Data", data);
    this.coreService.setIsLoading(true);
    if (this.discount) {
      //EDIT Discount
      this.adminDiscountService
        .updateDiscount(this.discount.id, data)
        .pipe(
          finalize(() => {
            this.dialogRef.close('edit');
            this.coreService.setIsLoading(false);
           
          })
        )
        .subscribe(
          (res) => {
            //FIND OUT WHAT IS CHANGED
            let change= '';
            if(this.discount.name !== data.name){
              change = 'Name Changed'
            } 
            if(this.discount.desc !== data.desc){
              change += ' Desc Changed'
            }
            if(this.discount.value !== data.value){
              change += ' value Changed'
            }
            this.adminDiscountService.addEventToItemHistory(this.discount.id,'DISCOUNT EDITED',change);
            this.coreService.presentSnackbar("Discount updated successfully!");
          },
          (err) => {
            console.log("Error in updating discount", err);
            this.coreService.setMessage(
              "Error in editing discount. Please try again!"
            );
          }
        );
    } else {
      //ADD PRODUCT
      this.adminDiscountService
        .addDiscount(data.name, data.desc, data.value)
        .pipe(
          finalize(() => {
         //   console.log(" in add product before closing dialog");
            this.dialogRef.close();
            this.coreService.setIsLoading(false);
          })
        )
        .subscribe(
          (res) => {
            console.log("Response in add discount", res);
            this.coreService.presentSnackbar("Discount added successfully!");
          },
          (err) => {
            console.log("Error in adding discount", err);
            this.coreService.presentSnackbar(
              "Error in adding discount. Please try again!"
            );
          }
        );
    }
  }

  close() {
    this.dialogRef.close();
  }
}
