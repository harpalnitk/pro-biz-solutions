import { Product } from './../../model/product';
import { CoreService } from './../../core/core.service';
import { ShopService } from './shop.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  products$: Observable<Product[]>;
  isLoading$: Observable<boolean>;
  productCount$: Observable<number>;

  // MatPaginator Inputs
  length = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0;
    // MatPaginator Output
    pageEvent: PageEvent;

    @ViewChild(MatPaginator) paginator: MatPaginator

  constructor(
    private shopService: ShopService,
    private coreService: CoreService,
    private route: ActivatedRoute,
  ) {
    this.products$ = this.shopService.getProducts().pipe(shareReplay());
    this.productCount$ = this.shopService.getProductCount();
  }

  ngOnInit(): void {
    this.isLoading$ = this.coreService.getIsLoading();
    this.shopService.fetchProducts();
  }

  // ngAfterViewInit(){
  //   this.route.queryParamMap.subscribe((paramMap)=>{
  //     //console.log({paramMap})
  //     const pageIndex = Number(paramMap.get('pageIndex'))
  //     const pageSize = Number(paramMap.get('pageSize'))
  //     if(pageSize){
  //       this.pageSize = pageSize
  //       this.paginator.pageSize = pageSize
  //     }
  //     if(pageIndex){
  //       this.pageIndex = pageIndex
  //       this.paginator.pageIndex = pageIndex
  //     }
  //     this.length = 50
  //   })
  // }
  ngOnDestroy(): void {
    this.coreService.setIsLoading(false);
  }

  handlePageEvent($event:PageEvent) {
    console.log($event);
            this.pageSize = $event.pageSize;
        this.paginator.pageSize = $event.pageSize;
        this.pageIndex = $event.pageIndex;
        this.paginator.pageIndex = $event.pageIndex;
    this.shopService.fetchProducts($event.pageIndex,$event.pageSize);
  }
}
