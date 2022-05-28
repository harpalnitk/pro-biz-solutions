import { ProfileConstants, UserProfile, AdminProfile, Official } from './../../../../model/profile.model';
import { CoreService } from '../../../../core/core.service';
import { AdminUsersService } from '../admin-users.service';

import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable, Subscription } from "rxjs";
import { finalize, tap } from "rxjs/operators";
//import { ProductConfigService, SelectValues } from '../product-config/product-config.service';



@Component({
  selector: "user-dialog",
  templateUrl: "./user-dialog.component.html",
  styleUrls: ["./user-dialog.component.scss"],
})
export class UserDialogComponent implements OnInit, OnDestroy{
  user:  AdminProfile;
  form: FormGroup;
  isLoading$: Observable<boolean>;
  //editMode = false;
  userTypes = ProfileConstants.USER_TYPES;
  userStatus = ProfileConstants.USER_STATUS;
  userRoles = ProfileConstants.USER_ROLES;

  userTypeSubscription: Subscription;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) user: AdminProfile,
    private adminUsersService: AdminUsersService,
    private coreService: CoreService,
    private cdRef: ChangeDetectorRef
  ) {
  
    console.log('injected user in user dialog component',user)
    this.user = user;
    this.isLoading$ = this.coreService.getIsLoading();
  }


  ngOnInit(): void {
    this.initForm();

    const userType = this.form.get('userType');
   const userTypeSubscription =  userType?.valueChanges.subscribe((value) => {
      console.log('UserType Changed', value);
      const roleControl = this.form.get('official')?.get('role') as FormControl;
         const designationControl = this.form.get('official')?.get('designation') as FormControl;
      if(value === 'S'){
         
         roleControl.enable();
         roleControl.setValidators(Validators.required);
         designationControl.enable();
        } else {
          delete this.user.official;
          roleControl.disable();
          roleControl.clearValidators();
          designationControl.disable();
        }
        roleControl.updateValueAndValidity();
        designationControl.updateValueAndValidity();
    });
  }
  ngAfterViewInit(): void {
    if (this.user) {
      this.patchForm();
    }
    console.log('before detectchanges');
    this.cdRef.detectChanges(); 
  }

  initForm() {
      this.form = new FormGroup({
        userType: new FormControl('', { validators: [Validators.required] }),
        official: new FormGroup({
          role: new FormControl({value:'', disabled:true}, {validators: [Validators.required]}),
          designation: new FormControl({value: '', disabled: true}),
        }),
        status: new FormControl('', { validators: [Validators.required] }),
      });
  }

  patchForm() {
    console.log("patchForm in user dialog component" );
    this.form.patchValue({
      userType: this.user.userType,
      status: this.user.status,
      official:{
        role: this.user['official'] ? this.user.official.role : null,
        designation:this.user['official'] ? this.user.official.designation : null
      }
    });
   
  }




  save() {

    //! BUG: when user saves the form without changing anything history is saved as blank
    if (this.form.invalid) {
      return;
    }
    const data = this.form.value;
    this.form.reset();
  //  console.log("Form Data", data);
    this.coreService.setIsLoading(true);
    if (this.user) {
      //EDIT Discount
      if (this.user.userType === 'P'){
        delete this.user.official
      }
      this.adminUsersService
        .updateUser(this.user.uid, data)
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
            let value = ''
            if(this.user.userType !== data.userType){
              change = 'UserType Changed';
              value= data.userType;
            } 
            if(this.user.status !== data.status){
              console.log(`User status ${this.user.status} data status ${data.status}`)
              change += ' Status Changed'
              value += ' ' + data.status
            }
            if(data.official?.role && (this.user.official?.role !== data.official?.role)){
              console.log(`User role ${this.user.official?.role} data role ${data.official?.role}`)
              change += ' Role Changed'
              value += ' ' + data.official?.role
            }
            this.adminUsersService.addEventToItemHistory(this.user.uid,change,value);
            this.coreService.presentSnackbar("User updated successfully!");
          },
          (err) => {
            console.log("Error in updating user", err);
            this.coreService.setMessage(
              "Error in editing user. Please try again!"
            );
          }
        );
    } 
    
    // else {
    //   //ADD PRODUCT
    //   this.adminUsersService
    //     .addUser(data.name, data.desc, data.value)
    //     .pipe(
    //       finalize(() => {
    //      //   console.log(" in add product before closing dialog");
    //         this.dialogRef.close();
    //         this.coreService.setIsLoading(false);
    //       })
    //     )
    //     .subscribe(
    //       (res) => {
    //         console.log("Response in add discount", res);
    //         this.coreService.presentSnackbar("Discount added successfully!");
    //       },
    //       (err) => {
    //         console.log("Error in adding discount", err);
    //         this.coreService.presentSnackbar(
    //           "Error in adding discount. Please try again!"
    //         );
    //       }
    //     );
    // }
  }

  close() {
    this.dialogRef.close();
  }
  ngOnDestroy(): void {
    if(this.userTypeSubscription){
      this.userTypeSubscription.unsubscribe();
    }
  }
}
