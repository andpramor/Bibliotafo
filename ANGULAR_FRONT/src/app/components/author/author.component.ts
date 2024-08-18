import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';

import { AuthorsService } from '../../services/authors/authors.service';
import { back_url } from '../../helpers/Constants';
import { Author } from '../../interfaces/Author';
import { Book } from '../../interfaces/Book';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { SaleItem } from '../../interfaces/SaleItem';
import { Sale } from '../../interfaces/Sale';
import { MessageService } from 'primeng/api';
import { SaleService } from '../../services/sale/sale.service';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrl: './author.component.css',
  standalone: true,
  imports: [
    DataViewModule,
    ButtonModule,
    CommonModule,
    RouterModule,
    FormsModule,
    DialogModule,
    InputNumberModule,
  ],
  providers: [AuthorsService],
})
export class AuthorComponent implements OnInit {
  base_url: string = back_url.url;
  sale_id: number;
  saleDialog: boolean = false;
  author: Author = {
    author_name: '',
    biography: '',
  };
  books: Book[];
  userRol: string | null;

  book: Book = {
    title: '',
    cover: '',
    price: 0,
    style: '',
    synopsis: '',
    stock: 0,
    publication_date: new Date(),
    ISBN: 0,
    publishername: '',
    genrenames: [],
    themenames: [],
    authornames: [],
  };

  saleItem: SaleItem = {
    book: 0,
    units: 1,
    cost: 0,
  };

  sale: Sale = {
    seller: undefined,
    buyer: undefined,
    sale_date: new Date(),
    sale_items: [],
  };

  constructor(
    private authorService: AuthorsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private saleService: SaleService,
    private messageService: MessageService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.authorService
      .getAuthorById(this.route.snapshot.params['id'])
      .subscribe({
        next: (author) => {
          this.author = author;
          this.books = author.books;
        },
        error: (error) => {
          console.log('Error: ', error);
        },
      });

    this.authService.getUserRol().subscribe((rol) => {
      this.userRol = rol;
    });
  }

  open(book: Book) {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.book = book;
    this.saleItem.book = book.id!;
    this.saleDialog = true;
  }

  close() {
    this.saleDialog = false;
  }

  addItem() {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.saleDialog = false;
    this.saleItem.cost = this.saleItem.units * this.book.price;
    console.log(this.saleItem);

    if (this.sale_id == 0 || this.sale_id == undefined) {
      //Si vamos a crear la venta, no me importa el vendedor (lo gestiona el back según quién haga la petición), ni el comprador: si la petición es de comprador, lo gestiona el back, y si es de vendedor, lo gestionaré al hacer la petición POST de confirmar el carrito/cerrar la venta.
      this.sale.sale_items = [this.saleItem];
      this.saleService.newSale(this.sale).subscribe({
        next: (newSale) => {
          localStorage.setItem('sale', newSale.id!.toString());
          this.saleService.loadCartCount();
          this.messageService.add({
            severity: 'success',
            summary: '¡Gracias!',
            detail: 'Carrito actualizado',
          });
        },
        error: (error) => {
          console.log('Error: ', error);
        },
      });
    } else {
      this.saleItem.sale = this.sale_id;
      this.saleService.newSaleItem(this.saleItem).subscribe({
        next: () => {
          this.saleService.loadCartCount();
          this.messageService.add({
            severity: 'success',
            summary: '¡Gracias!',
            detail: 'Carrito actualizado',
          });
        },
        error: (error) => {
          console.log('Error: ', error);
        },
      });
    }
  }
}
