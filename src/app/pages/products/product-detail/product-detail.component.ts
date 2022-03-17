import { ProductAdminService } from '../../admin/product/product-admin.service';
import { Product } from './../../../model/product';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CoreService } from 'app/core/core.service';

@Component({
  selector: 'product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: Product;
  width: string;
  isLoading$: Observable<boolean>;
  constructor(    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private coreService: CoreService,
    private productAdminService: ProductAdminService) {
      this.isLoading$ = this.coreService.getIsLoading();
     }

  ngOnInit(): void {
    this.width = this.coreService.getWidth();
    this.product = this.route.snapshot.data["item"];
   // console.log("Inside product item", this.product);
    this.coreService.setIsLoading(false);
  }
  addToCart(){}
  addToWishlist(){

  }

}
