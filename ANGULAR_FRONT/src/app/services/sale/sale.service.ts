import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Sale } from '../../interfaces/Sale';
import { HttpClient } from '@angular/common/http';
import { api_url } from '../../helpers/Constants';
import { SaleItem } from '../../interfaces/SaleItem';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private BASE_URL = api_url.url + 'shop/sales/'

  private inCart$ = new BehaviorSubject<number>(0);

  constructor(private httpClient: HttpClient) {
    this.loadCartCount()
  }

  getInCart(): Observable<number> {
    return this.inCart$.asObservable();
  }

  setInCart(value: number) {
    this.inCart$.next(value);
  }

  loadCartCount() {
    const saleId = Number(localStorage.getItem('sale'));
    if (saleId !== 0) {
      this.getSale(saleId).subscribe(sale => {
        this.setInCart(sale.sale_items.length);
      });
    } else {
      this.setInCart(0);
    }
  }

  getSale(id: number): Observable<Sale> {
    return this.httpClient.get<Sale>(this.BASE_URL+id+'/')
  }

  getSales(): Observable<Sale[]> {
    return this.httpClient.get<Sale[]>(this.BASE_URL)
  }

  newSale(newSale: Sale): Observable<Sale>{
    return this.httpClient.post<Sale>(this.BASE_URL, newSale, { withCredentials: true });
  }

  confirmSale(sale_id: number) {
    return this.httpClient.patch(this.BASE_URL + sale_id + '/', {'sale_done': true}, { withCredentials: true });
  }

  confirmSaleWithBuyer(sale_id: number, buyer: number) {
    return this.httpClient.patch(this.BASE_URL + sale_id + '/', {'sale_done': true, 'buyer': buyer}, { withCredentials: true });
  }

  newSaleItem(newItem: SaleItem): Observable<SaleItem> {
    return this.httpClient.post<SaleItem>(this.BASE_URL + 'saleItem/', newItem, { withCredentials: true });
  }

  updateSaleItem(item: SaleItem){
    return this.httpClient.patch(this.BASE_URL + 'saleItem/' + item.id + '/', {'units': item.units, 'cost': item.cost}, { withCredentials: true });
  }

  deleteSaleItem(item: SaleItem): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + 'saleItem/' + item.id + '/', { withCredentials: true });
  }

  deleteSaleItemsList(itemsList: number[]): Observable<void>{
    return this.httpClient.request<void>('delete', this.BASE_URL + 'bulk_delete_saleitems/', {
      withCredentials: true,
      body: { ids: itemsList }
    });
  }

}
