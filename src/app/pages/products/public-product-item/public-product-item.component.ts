import { ProductAdminService } from '../../admin/product/product-admin.service';
import { ShopService } from './../../shop/shop.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoreService } from 'app/core/core.service';
import { Product } from 'app/model/product';
import { Observable } from 'rxjs';

@Component({
  selector: 'public-product-item',
  templateUrl: './public-product-item.component.html',
  styleUrls: ['./public-product-item.component.scss']
})
export class PublicProductItemComponent implements OnInit {

  @Input() product: Product;
  @Input() buttons: boolean[]; // Edit, Detail, Delete, AddToCart
  isLoading$: Observable<boolean>;
  // imageToShow: any;
  // isImageLoading = false;
 


  constructor(
    private router: Router,
    private shopService: ShopService,
    private productAdminService: ProductAdminService,
    private coreService: CoreService,
    private cdref: ChangeDetectorRef 
  ) {}
  ngAfterViewInit(): void {
   
  
 // console.log(this.isGrid);
  //console.log(this.buttons);
  this.cdref.detectChanges();
}

  ngOnInit(): void {
    // this.isLoading$ = this.coreService.getIsLoadingChild();
   // console.log(this.product.imageUrl);
   // this.getImageFromService(this.product.imageUrl);
  }

  // onEdit() {
  //   this.router.navigateByUrl(`/product/edit/${this.product._id}`);
  // }

  onDetail() {
    this.router.navigateByUrl(`/product/${this.product.id}`);
  }
  addToCart() {
    this.shopService.addToCart(this.product.id);
    this.router.navigateByUrl(`/cart`);
  }
  // onDelete() {
  //   this.productService.deleteProduct(this.product._id);
  // }
  ngOnDestroy(): void {
    // this.coreService.setIsLoadingChild(false);
  }
}
