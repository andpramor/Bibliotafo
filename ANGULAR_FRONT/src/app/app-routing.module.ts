import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error-404/error-404.component';
import { PublishersCrudComponent } from './components/publishers-crud/publishers-crud.component';
import { ManagerGuard } from './helpers/guards/manager.guard';
import { GenresCrudComponent } from './components/genres-crud/genres-crud.component';
import { ThemesCrudComponent } from './components/themes-crud/themes-crud.component';
import { BooksCrudComponent } from './components/books-crud/books-crud.component';
import { AuthorsCrudComponent } from './components/authors-crud/authors-crud.component';
import { AuthorComponent } from './components/author/author.component';
import { BookComponent } from './components/book/book.component';
import { CartComponent } from './components/cart/cart.component';
import { SalesListComponent } from './components/sales-list/sales-list.component';
import { SaleComponent } from './components/sale/sale.component';
import { LogedInGuard } from './helpers/guards/logedIn.guard';
import { CreateUpdateAccountComponent } from './components/create-update-account/create-update-account.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { RatingsListComponent } from './components/ratings-list/ratings-list.component';
import { LoaderComponent } from './components/loader/loader.component';

const routes: Routes = [
  //Home
  {path: '', component: HomeComponent},

  //Accounts
  {path: 'cuenta', component: CreateUpdateAccountComponent},
  {path: 'nuevo_trabajador', component: CreateUpdateAccountComponent, canActivate: [ManagerGuard]},
  {path: 'usuario/:id', component: UserProfileComponent, canActivate: [LogedInGuard]},
  {path: 'miperfil', component: UserProfileComponent, canActivate: [LogedInGuard]},

  //Shop
  {path: 'editoriales', component: PublishersCrudComponent, canActivate: [ManagerGuard]},
  {path: 'generos', component: GenresCrudComponent, canActivate: [ManagerGuard]},
  {path: 'temas', component: ThemesCrudComponent, canActivate: [ManagerGuard]},
  {path: 'autores', component: AuthorsCrudComponent},
  {path: 'autor/:id', component: AuthorComponent},
  {path: 'libros', component: BooksCrudComponent},
  {path: 'libro/:id', component: BookComponent},
  {path: 'carrito', component: CartComponent, canActivate: [LogedInGuard]},
  {path: 'historial', component: SalesListComponent, canActivate: [LogedInGuard]},
  {path: 'transaccion/:id', component: SaleComponent, canActivate: [LogedInGuard]},

  //Social
  {path: 'comentarios/usuario/:id', component: ReviewsListComponent, canActivate: [LogedInGuard]},
  {path: 'comentarios/libro/:id', component: ReviewsListComponent, canActivate: [LogedInGuard]},
  {path: 'valoraciones/usuario/:id', component: RatingsListComponent, canActivate: [LogedInGuard]},

  {path: 'pruebaloader', component: LoaderComponent},

  //Error 404
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
