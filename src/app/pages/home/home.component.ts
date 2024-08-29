import { Component,  OnDestroy,  OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../../models/product.model';
import { CartService } from '../../service/cart.service';
import { StoreService } from '../../service/store.service';


const ROWS_HEIGHT : { [id:number]: number } = { 1: 400, 3: 355, 4: 350 };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy{
  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '48';
  category : string | undefined;
  productsSubcription : Subscription | undefined;


  constructor(
    private cartService: CartService,
    private storeService:StoreService,
  ) {}

  ngOnInit():void {
    this.getProducts();
  }
  
  oncolumnsCountChange(colsNum: number): void{
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
  }
  onItemsCountChange(newcount: number): void {
      this.count = newcount.toString(); 
      this.getProducts();

    }
  
    onsortChange(newSort: string) :void{
      this.sort = newSort;
      this.getProducts();

    }

  onShowCategory(newCategory: string): void{
    this.category = newCategory;
    this.getProducts();
  }

  
  
  getProducts():void {
    this.productsSubcription = this.storeService.getAllProducts(this.count, this.sort, this.category )
    .subscribe((_products) => {
      this.products = _products;
    })
  }

  onAddToCart(product: Product): void{
    this.cartService.addToCart({
      product: product.image, 
      name : product.title,
      price: product.price,
      quantity : 1,
      id : product.id,
    });
  }
  

  ngOnDestroy(): void {
      if(this.productsSubcription){
        this.productsSubcription.unsubscribe();

      }
  }

}
