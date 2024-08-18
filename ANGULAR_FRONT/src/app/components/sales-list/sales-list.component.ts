import { Component, OnInit, ViewChild } from '@angular/core';
import { Sale } from '../../interfaces/Sale';
import { SaleService } from '../../services/sale/sale.service';
import { CommonModule, DatePipe, ViewportScroller } from '@angular/common';
import { AuthService } from '../../services/common/auth-service/auth.service';

import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
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
import { MultiSelectModule } from 'primeng/multiselect';

import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-sales-list',
  templateUrl: './sales-list.component.html',
  styleUrl: './sales-list.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, RouterModule, MultiSelectModule, CalendarModule, ScrollPanelModule],
  providers: [SaleService, DatePipe]
})
export class SalesListComponent implements OnInit {

  @ViewChild('dt') table: Table;

  userRol: string | null

  sales: Sale[]
  sale: Sale

  saleDialog: boolean = false;
  submitted: boolean = false;

  constructor(private authService: AuthService, private saleService: SaleService, private datePipe: DatePipe, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0,0])
    this.authService.getUserRol().subscribe(rol => {
      this.userRol = rol
    })

    this.saleService.getSales().subscribe({
      next: (data) => {
        this.sales = data
        console.log(data)
      },
      error: (error) => {
        console.log('Error: ', error)
      }
    })
    //TODO: get clientes para poner los nombres si es vendedor??
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm')!;
  }

  onGlobalFilter(event: Event, table: Table) {
    const target = event.target as HTMLInputElement;
    table.filterGlobal(target.value, 'contains');
  }

  onPageChange() {
    const tableElement = this.table.el.nativeElement;
    tableElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

}
