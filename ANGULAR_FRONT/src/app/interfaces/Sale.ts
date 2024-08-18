import { SaleItem } from "./SaleItem"

export interface Sale {
    id?: number
    seller?: number
    buyer?: number //No es obligatorio porque puede ser venta en tienda a un cliente de paso que no se identifique.
    sale_date: Date
    sale_items: SaleItem[]
}