import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MultiSelectModule } from 'primeng/multiselect';

import { BooksService } from '../../services/books/books.service';
import { Book } from '../../interfaces/Book';
import { back_url } from '../../helpers/Constants'

import { RouterModule } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { AuthorsService } from '../../services/authors/authors.service';
import { PublishersService } from '../../services/publishers/publishers.service';
import { GenresService } from '../../services/genres/genres.service';
import { ThemesService } from '../../services/themes/themes.service';
import { BookForBack } from '../../interfaces/BookForBack';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { LoaderComponent } from '../loader/loader.component';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-books-crud',
  templateUrl: './books-crud.component.html',
  styleUrl: './books-crud.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, RouterModule, MultiSelectModule, CalendarModule, ScrollPanelModule, LoaderComponent],
  providers: [MessageService, ConfirmationService, BooksService]
})
export class BooksCrudComponent implements OnInit {

  @ViewChild('dt') table: Table;

  base_url: string = back_url.url;
  userRol: string | null;
  
  bookDialog: boolean = false;
  submitted: boolean = false;

  books!: Book[];
  book!: Book;
  cover: File | null = null;
  cover_name: string | null;
  selectedBooks!: Book[] | null;

  authorOptions: { label: string | undefined, value: number | undefined }[] = [];
  publisherOptions: { label: string | undefined, value: number | undefined }[] = [];
  genreOptions: { label: string | undefined, value: number | undefined }[] = [];
  themeOptions: { label: string | undefined, value: number | undefined }[] = [];
  styleOptions = [
    { label: 'Pasta dura', value: 'dura' },
    { label: 'Pasta blanda', value: 'blanda' },
    { label: 'Bolsillo', value: 'bolsillo' }
  ];

  loaded: boolean = false

  constructor(private bookService: BooksService, private authorService: AuthorsService, private publisherService: PublishersService, private genreService: GenresService, private themeService: ThemesService, private authService: AuthService, private messageService: MessageService, private confirmationService: ConfirmationService, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0,0])
    this.authService.getUserRol().subscribe(rol => {
      this.userRol = rol
    })

    this.authorService.getAuthors().subscribe({
      next: (authors) => {
        this.authorOptions = authors.map(author => ({
          label: author.author_name,
          value: author.id
        }))
      },
      error: (error) => {
        console.log("Error: ", error)
      }
    })

    this.publisherService.getPublishers().subscribe({
      next: (publishers) => {
        this.publisherOptions = publishers.map(publisher => ({
          label: publisher.publisher_name,
          value: publisher.id
        }))
      },
      error: (error) => {
        console.log("Error: ", error)
      }
    })

    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genreOptions = genres.map(genre => ({
          label: genre.genre_name,
          value: genre.id
        }))
      },
      error: (error) => {
        console.log("Error: ", error)
      }
    })

    this.themeService.getThemes().subscribe({
      next: (themes) => {
        this.themeOptions = themes.map(theme => ({
          label: theme.theme_name,
          value: theme.id
        }))
      },
      error: (error) => {
        console.log("Error: ", error)
      }
    })

    this.refreshBooks()
  }

  refreshBooks() {
    this.viewportScroller.scrollToPosition([0,0])
    this.bookService.getBooks().subscribe({
      next: (booksData) => {
        this.books = booksData.map(bookData => ({
          ...bookData,
          authorsString: bookData.authornames?.map(author => author.author_name).join(', ')
          })
        )
        this.loaded = true
      }
    });
  }

  getSelectedIds() {
    return this.selectedBooks!.map(book => book.id).filter(id => id !== undefined) as number[];
  }

  openNew() {
    this.viewportScroller.scrollToPosition([0,0])

    this.book = {
        id: undefined,
        title: '',
        ISBN: 0,
        publication_date: new Date(),
        synopsis: '',
        cover: undefined,
        stock: 0,
        price: 0,
        style: '',
        publisher: 0,
        authors: [],
        genres: [],
        themes: []
    };

    this.cover = null;
    this.cover_name = null;

    this.submitted = false;
    this.bookDialog = true;
  }

  deleteSelectedBooks() {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que desea eliminar los libros seleccionados?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
              this.bookService.deleteBooksList(this.getSelectedIds()).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Libros eliminados', life: 3000 });
                  this.refreshBooks();
                },
                error: (err) => {
                  console.error('Error deleting books:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error eliminando libros', life: 3000 });
                }
              });
              this.selectedBooks = null;
          }
      });
  }

  editBook(book: Book) {
    this.viewportScroller.scrollToPosition([0,0])
    let { cover, publication_date, ...bookWithoutCover } = book; //"Desestructuración de objetos", saco el campo cover para evitar problemas con el patch, sólo se enviará cover si se añade una al editar, si no se mantiene la que ya había porque no será parte de la petición PATCH.
    publication_date = new Date(publication_date)
    this.book = { publication_date, ...bookWithoutCover };
    this.cover = null;
    this.cover_name = null;
    this.bookDialog = true;
  }

  deleteBook(book: Book) {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que quieres eliminar: "' + book.title + '"?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.bookService.deleteBook(book).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Libro eliminado', life: 3000 });
                    this.refreshBooks();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error borrando el libro', life: 3000 });
                }
            })

            this.book = {
              id: undefined,
              title: '',
              ISBN: 0,
              publication_date: new Date(),
              synopsis: '',
              cover: '',
              stock: 0,
              price: 0,
              style: '',
              publisher: 0,
              authors: [],
              genres: [],
              themes: []
            };
          }
      });
  }

  hideDialog() {
      this.bookDialog = false;
      this.submitted = false;
  }

  formatDateToYYYYMMDD(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  saveBook() {
    this.viewportScroller.scrollToPosition([0,0])
      this.submitted = true;

      if (this.book.title?.trim()) {

        //Descompongo el libro en fecha de publicación (que reescribo a YYYY-MM-DD) y el resto de sus atributos.
        const bookToSave: BookForBack = {...this.book, publication_date: this.formatDateToYYYYMMDD(this.book.publication_date)};

        if (this.book.id) { //Si tiene id estoy actualizando.
            this.bookService.updateBook(bookToSave, this.cover).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Libro actualizado', life: 3000 });
                  this.refreshBooks();
                },
                error: (err) => {
                  console.error('Error updating book:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error actualizando el libro',  life: 3000 });
                }
              });
        }

        else { //Si no tiene id estoy creando.
          this.bookService.createBook(bookToSave, this.cover).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Libro creado',  life: 3000 });
                this.refreshBooks();
            },
            error: (error) => {
                console.error('Error creating book:', error);
                this.messageService.add({ severity: 'error', summary: 'Error creando el libro',  life: 3000 });
            }
          })
        }

        this.bookDialog = false;
        this.book = {
          id: undefined,
          title: '',
          ISBN: 0,
          publication_date: new Date(),
          synopsis: '',
          cover: '',
          stock: 0,
          price: 0,
          style: '',
          publisher: 0,
          authors: [],
          genres: [],
          themes: []
        };
        this.cover = null;
        this.cover_name = null;
      }
  }

  onFileUpload(event: any) {
    this.cover = event.files[0]
    this.cover_name = event.files[0].name
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'La foto se ha subido correctamente' })
  }

  cleanPic() {
    this.cover = null
    this.cover_name = null
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