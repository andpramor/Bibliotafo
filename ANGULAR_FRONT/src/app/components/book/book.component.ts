import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { DatePipe } from '@angular/common';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';

import { BooksService } from '../../services/books/books.service';
import { back_url } from '../../helpers/Constants';
import { Book } from '../../interfaces/Book';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { SaleService } from '../../services/sale/sale.service';
import { SaleItem } from '../../interfaces/SaleItem';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Sale } from '../../interfaces/Sale';
import { FavouritesService } from '../../services/favourites/favourites.service';
import { Favourite } from '../../interfaces/Favourite';
import { RatingModule } from 'primeng/rating';
import { Rating } from '../../interfaces/Rating';
import { RatingService } from '../../services/rating/rating.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  standalone: true,
  imports: [DataViewModule, DialogModule, ButtonModule, CommonModule, RouterModule, FormsModule, InputNumberModule, RippleModule, ToastModule, RatingModule, ConfirmDialogModule],
  providers: [BooksService, DatePipe, MessageService, ConfirmationService]
})
export class BookComponent implements OnInit {

  userRol: string | null
  sale_id: number
  saleDialog: boolean = false
  ratingDialog: boolean = false
  base_url: string = back_url.url

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
    avg_rating: 0,
    times_rated: 0
  };

  saleItem: SaleItem = {
    book: 0,
    units: 1,
    cost: 0
  }

  sale: Sale = {
    seller: undefined,
    buyer: undefined,
    sale_date: new Date(),
    sale_items: []
  }

  favourite: Favourite | undefined
  isFavourite: boolean = false

  rating: Rating | undefined
  new_rating: number

  constructor(private bookService: BooksService, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthService, private saleService: SaleService, private messageService: MessageService, private favouritesService: FavouritesService, private ratingService: RatingService, private confirmationService: ConfirmationService, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0,0])

    this.sale_id = Number(localStorage.getItem('sale'))
    console.log(this.route.snapshot.params['id'])

    this.reloadBook()

    this.authService.getUserRol().subscribe(rol => {
      this.userRol = rol
      if(rol){
        this.reloadFavs()
      }
    })
  }

  reloadBook(){
    this.viewportScroller.scrollToPosition([0,0])
    this.bookService.getBookById(this.route.snapshot.params['id']).subscribe({
      next: data => {
        this.book = data
        this.saleItem = {
          book: data.id!,
          units: 1,
          cost: data.price
        }
        this.reloadRatings()
      },
      error: error => {console.log('Error: ', error)}
    })
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy')!;
  }

  getFormattedStyle(style: string): string {
    switch (style) {
      case 'blanda':
        return 'Tapa blanda';
      case 'dura':
        return 'Tapa dura';
      case 'bolsillo':
        return 'Edición de bolsillo';
      default:
        return style;
    }
  }

  openSale(){
    this.viewportScroller.scrollToPosition([0,0])
    this.saleDialog = true
  }

  openRate(){
    this.viewportScroller.scrollToPosition([0,0])
    this.ratingDialog = true
  }

  close(){
    this.saleDialog = false
    this.ratingDialog = false
  }

  addItem(){
    this.viewportScroller.scrollToPosition([0,0])
    this.saleDialog = false
    this.saleItem.cost = this.saleItem.units * this.book.price

    if(this.sale_id == 0 || this.sale_id == undefined) {
      //Si vamos a crear la venta, no me importa el vendedor (lo gestiona el back según quién haga la petición), ni el comprador: si la petición es de comprador, lo gestiona el back, y si es de vendedor, lo gestionaré al hacer la petición POST de confirmar el carrito/cerrar la venta.
      this.sale.sale_items = [this.saleItem]
      this.saleService.newSale(this.sale).subscribe({
        next: (newSale) => {
          localStorage.setItem('sale', newSale.id!.toString())
          this.saleService.loadCartCount()
          this.messageService.add({ severity: 'success', summary: '¡Gracias!', detail: 'Carrito actualizado' });
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })

    } else {
      this.saleItem.sale = this.sale_id;
      this.saleService.newSaleItem(this.saleItem).subscribe({
        next: () => {
          this.saleService.loadCartCount()
          this.messageService.add({ severity: 'success', summary: '¡Gracias!', detail: 'Carrito actualizado' });
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    }
  }

  reloadFavs(){
    this.favouritesService.getFavouritesByUser(Number(localStorage.getItem('user_id'))).subscribe({
      next: (response) => {
        const bookId = Number(this.route.snapshot.params['id']);
        this.favourite = response.find(favourite => favourite.book === bookId);
        this.isFavourite = !!this.favourite;
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  reloadRatings(){
    this.ratingService.getRatingsByUser(Number(localStorage.getItem('user_id'))).subscribe({
      next: (response) => {
        const bookId = Number(this.route.snapshot.params['id']);
        this.rating = response.find(rating => rating.book === bookId);
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })

  }

  addFav(){
    const user = Number(localStorage.getItem('user_id'))
    const book_id = Number(this.route.snapshot.params['id'])
    this.favouritesService.addFavourite(user, book_id).subscribe({
      next: () => {
        this.reloadFavs()
        console.log('Favorito añadido')
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  delFav(){
    this.favouritesService.deleteFavourite(this.favourite!.id!).subscribe({
      next: () => {
        this.reloadFavs()
        console.log('Favorito eliminado')
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  rate(){
    const user = Number(localStorage.getItem('user_id'))
    const book_id = Number(this.route.snapshot.params['id'])
    //this.reloadRatings
    this.ratingService.addRating(user, book_id, this.new_rating).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Valoración añadida', life: 3000 });
        this.reloadBook()
        this.reloadRatings()
        this.close()
      },
      error: (error) => {
        console.log('Error: ', error)
        this.messageService.add({ severity: 'error', summary: 'Error añadiendo la valoración', life: 3000 });
      }
    })
  }

  deleteRate(){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Eliminar tu valoración?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.ratingService.deleteRating(this.rating!.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Valoración eliminada', life: 3000 });
            this.reloadRatings()
            this.reloadBook()
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error eliminando la valoración', life: 3000 });
            console.log('Error: ', error)
          }
        })
      }
    })
  }

}
