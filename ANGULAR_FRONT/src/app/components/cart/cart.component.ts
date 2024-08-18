import { Component, OnInit, ViewChild } from '@angular/core';
import { SaleItem } from '../../interfaces/SaleItem';
import { SaleService } from '../../services/sale/sale.service';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';

import { AuthorsService } from '../../services/authors/authors.service';
import { Router, RouterModule } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { MyUser } from '../../interfaces/MyUser';
import { UsersService } from '../../services/users/users.service';
import { BooksService } from '../../services/books/books.service';
import { back_url } from '../../helpers/Constants';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, RouterModule, DropdownModule],
  providers: [MessageService, ConfirmationService, AuthorsService, DecimalPipe]
})
export class CartComponent implements OnInit {

  @ViewChild('dt') table: Table;

  userRol: string | null = null
  base_url: string = back_url.url + 'media/'

  clients: MyUser[]
  selectedClient: any

  book_price: number
  book_stock: number
  sale_id: number
  buyer: number | undefined = undefined
  sale_items!: SaleItem[]
  saleItem: SaleItem
  total_cost: number = 0

  itemDialog: boolean = false
  submitted: boolean = false
  selectedItems!: SaleItem[] | null

  constructor(private saleService: SaleService, private messageService: MessageService, private confirmationService: ConfirmationService, private router: Router, private authService: AuthService, private userService: UsersService, private bookService: BooksService, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0,0])
    this.sale_id = Number(localStorage.getItem('sale'))
    if (Number(localStorage.getItem('sale')) != 0) {
      this.refreshItems()
    }

    this.userService.getClients().subscribe({
      next: (data) => {
        this.clients = data
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })

    this.authService.getUserRol().subscribe({
      next:(rol) => {
        this.userRol = rol
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  onClientChange() {
    if (this.selectedClient !== null) {
      this.buyer = this.selectedClient.id;
    } else {
      this.buyer = undefined;
    }
    console.log(this.buyer)
  }

  buy(){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Confirmas la compra?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        if (this.buyer == undefined) {
          this.saleService.confirmSale(this.sale_id).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Compra realizada, ¡gracias!', life: 3000 });
                  localStorage.setItem('sale', '0')
                  this.saleService.setInCart(0)
                  setTimeout(() => {this.router.navigate([''])}, 800)
              },
              error: (error) => {
                console.error('Error: ', error);

                // Verifico si el error es de stock insuficiente
                if (error.status === 400 && error.error && error.error.detail === 'Insufficient stock for books' && error.error.books) {
                    const noStockBooks = error.error.books.join(', ');
                    const errorMessage = `Stock insuficiente para los libros: ${noStockBooks}`;
                    this.messageService.add({ severity: 'error', summary: 'Error realizando la compra', detail: errorMessage, life: 5000 });
                } else {
                    this.messageService.add({ severity: 'error', summary: 'Error realizando la compra', life: 3000 });
                }
              }
          })
        } else {
          this.saleService.confirmSaleWithBuyer(this.sale_id, this.buyer).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Compra realizada, ¡gracias!', life: 3000 });
                localStorage.setItem('sale', '0')
                this.saleService.setInCart(0)
                setTimeout(() => {this.router.navigate([''])}, 800)
            },
            error: (error) => {
              console.error('Error: ', error);
              this.messageService.add({ severity: 'error', summary: 'Error realizando la compra', life: 3000 });
            }
        })
        }
      }
  });
  }

  refreshItems(){
    this.viewportScroller.scrollToPosition([0,0])
    this.saleService.getSale(this.sale_id).subscribe({
      next: (data) => {
        this.sale_items = data.sale_items
        this.total_cost = 0
        for(let item of data.sale_items){
          this.total_cost += Number(item.cost)
        }
        this.saleService.loadCartCount()
        console.log(data.sale_items.length)
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  getSelectedIds() {
    return this.selectedItems!.map(item => item.id).filter(id => id !== undefined) as number[];
  }

  getAllIds() {
    return this.sale_items!.map(item => item.id).filter(id => id !== undefined) as number[];
  }

  editItem(item: SaleItem) {
    this.viewportScroller.scrollToPosition([0,0])
    this.saleItem = item;

    this.bookService.getBookById(this.saleItem.book).subscribe({
      next: (data) => {
        this.book_price = data.price
        this.book_stock = data.stock
        this.itemDialog = true
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
  }

  updateItem() {
    this.viewportScroller.scrollToPosition([0,0])
    this.submitted = true;
    this.saleService.updateSaleItem(this.saleItem).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Carrito actualizado', life: 3000 })
        this.refreshItems()
        this.itemDialog = false
      },
      error: (error) => {
        console.error('Error updating author:', error)
        this.messageService.add({ severity: 'error', summary: 'Error actualizando',  life: 3000 })
        this.itemDialog = false
      }
    });
  }

  updateCost() {
    if (this.saleItem && this.saleItem.units && this.book_price) {
      this.saleItem.cost = this.saleItem.units * this.book_price;
    }
  }

  deleteItem(item: SaleItem) {
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
        message: '¿Seguro que quieres quitar este libro del carrito?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.saleService.deleteSaleItem(item).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Carrito actualizado', life: 3000 });
                  this.refreshItems();
              },
              error: (error) => {
                console.error('Error: ', error);
                this.messageService.add({ severity: 'error', summary: 'Error quitando el libro', life: 3000 });
              }
          })
        }
    });
  }

  deleteSelectedItems() {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que desea eliminar los elementos seleccionados?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
              this.saleService.deleteSaleItemsList(this.getSelectedIds()).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Carrito actualizado', life: 3000 });
                  this.refreshItems();
                },
                error: (error) => {
                  console.error('Error: ', error);
                  this.messageService.add({ severity: 'error', summary: 'Error actualizando el carrito', life: 3000 });
                }
              });
              this.selectedItems = null;
          }
      });
  }

  deleteAllItems() {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
      message: '¿Seguro que desea eliminar todos los elementos del carrito?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
          this.saleService.deleteSaleItemsList(this.getAllIds()).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Carrito actualizado', life: 3000 });
              this.refreshItems();
            },
            error: (error) => {
              console.error('Error: ', error);
              this.messageService.add({ severity: 'error', summary: 'Error actualizando el carrito', life: 3000 });
            }
          });
          this.selectedItems = null;
      }
  });
  }

  close() {
    this.refreshItems();
    this.itemDialog = false;
    this.submitted = false;
  }

  onPageChange() {
    const tableElement = this.table.el.nativeElement;
    tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}