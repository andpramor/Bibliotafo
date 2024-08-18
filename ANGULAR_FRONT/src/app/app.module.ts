import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';

import { AuthService } from './services/common/auth-service/auth.service';
import { BooksService } from './services/books/books.service';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './components/error-404/error-404.component';
import { PublishersCrudComponent } from './components/publishers-crud/publishers-crud.component';
import { FooterComponent } from './components/footer/footer.component';

import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { GenresCrudComponent } from './components/genres-crud/genres-crud.component';
import { ThemesCrudComponent } from './components/themes-crud/themes-crud.component';
import { ProfileMenuComponent } from './components/profile-menu/profile-menu.component';
import { BooksCrudComponent } from './components/books-crud/books-crud.component';
import { AuthorsCrudComponent } from './components/authors-crud/authors-crud.component';
import { AuthorComponent } from './components/author/author.component';
import { BookComponent } from './components/book/book.component';
import { CartComponent } from './components/cart/cart.component';
import { SalesListComponent } from './components/sales-list/sales-list.component';
import { SaleComponent } from './components/sale/sale.component';
import { CreateUpdateAccountComponent } from './components/create-update-account/create-update-account.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { RatingsListComponent } from './components/ratings-list/ratings-list.component';
import { LoaderComponent } from './components/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent
  ],
  imports: [
    AuthorComponent,
    BookComponent,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NavbarComponent,
    LoginComponent,
    LogoutComponent,
    PublishersCrudComponent,
    GenresCrudComponent,
    ThemesCrudComponent,
    ProfileMenuComponent,
    AuthorsCrudComponent,
    BooksCrudComponent,
    SalesListComponent,
    SaleComponent,
    CartComponent,
    CreateUpdateAccountComponent,
    UserProfileComponent,
    ReviewsListComponent,
    RatingsListComponent,
    ToastModule,
    LoaderComponent,
    Error404Component
  ],
  providers: [
    AuthService,
    BooksService,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
