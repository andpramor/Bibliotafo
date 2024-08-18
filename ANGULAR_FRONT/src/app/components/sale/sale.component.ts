import { Component, OnInit } from '@angular/core';
import { Sale } from '../../interfaces/Sale';
import { SaleService } from '../../services/sale/sale.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { back_url } from '../../helpers/Constants';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css',
  standalone: true,
  imports: [ButtonModule, CommonModule, RouterModule],
  providers: [SaleService, DatePipe]
})
export class SaleComponent implements OnInit {
  
  sale: Sale //Inicializar para evitar el error en consola que no lee sale_date porque lo intenta antes de que llegue
  userRol: string | null
  base_url: string = back_url.url + 'media/'

  constructor(private saleService: SaleService, private route: ActivatedRoute, private authService: AuthService, private datePipe:DatePipe){}

  ngOnInit(): void {
      this.saleService.getSale(this.route.snapshot.params['id']).subscribe({
        next: (data) => {
          this.sale = data
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })

      this.authService.getUserRol().subscribe({
        next: (rol) => {
          this.userRol = rol
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
  }

  getFormattedDate(date: Date): string {
    return this.datePipe.transform(date, 'dd-MM-yyyy HH:mm')!;
  }
}
