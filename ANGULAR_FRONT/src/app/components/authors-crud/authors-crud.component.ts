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

import { AuthorsService } from '../../services/authors/authors.service';
import { Author } from '../../interfaces/Author';
import { back_url } from '../../helpers/Constants'
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/common/auth-service/auth.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-authors-crud',
  templateUrl: './authors-crud.component.html',
  styleUrl: './authors-crud.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule, RouterModule],
  providers: [MessageService, ConfirmationService, AuthorsService]
})
export class AuthorsCrudComponent implements OnInit {

  @ViewChild('dt') table: Table

  base_url: string = back_url.url
  userRol: string | null
  authorDialog: boolean = false
  submitted: boolean = false

  authors!: Author[];
  author: Author = {
    id: undefined,
    author_name: '',
    biography: '',
    author_photo: undefined,
  }
  photo: File | null = null
  photo_name: string | null
  selectedAuthors!: Author[] | null



  constructor(private authorService: AuthorsService, private messageService: MessageService, private confirmationService: ConfirmationService, private authService: AuthService, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.authService.getUserRol().subscribe(rol => {
      this.userRol = rol
    })

    this.refreshAuthors()
  }

  refreshAuthors() {
    this.viewportScroller.scrollToPosition([0,0])
    this.authorService.getAuthors().subscribe({
        next: (data) => {this.authors = data}
    });
  }

  getSelectedIds() {
    return this.selectedAuthors!.map(author => author.id).filter(id => id !== undefined) as number[];
  }

  openNew() {
    this.viewportScroller.scrollToPosition([0,0])

    this.author = {
        id: undefined,
        author_name: '',
        biography: '',
        author_photo: undefined,
    };

    this.photo = null
    this.photo_name = null;

    this.submitted = false;
    this.authorDialog = true;
  }

  deleteSelectedAuthors() {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que desea eliminar los autores seleccionados?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
              this.authorService.deleteAuthorsList(this.getSelectedIds()).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Autores eliminados', life: 3000 });
                  this.refreshAuthors();
                },
                error: (err) => {
                  console.error('Error deleting authors:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error eliminando autores', life: 3000 });
                }
              });
              this.selectedAuthors = null;
          }
      });
  }

  editAuthor(author: Author) {
    this.viewportScroller.scrollToPosition([0,0])
    const { author_photo, ...authorWithoutCover } = author; //"Desestructuración de objetos", saco el campo author_photo para evitar problemas con el patch, sólo se enviará author_photo si se añade una al editar, si no se mantiene la que ya había porque no será parte de la petición PATCH.
    this.author = { ...authorWithoutCover };
    this.authorDialog = true;
  }

  deleteAuthor(author: Author) {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que quieres eliminar: "' + author.author_name + '"?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.authorService.deleteAuthor(author).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Autor eliminado', life: 3000 });
                    this.refreshAuthors();
                },
                error: (error) => {
                  console.error('Error: ', error);
                  this.messageService.add({ severity: 'error', summary: 'Error borrando el autor', life: 3000 });
                }
            })

            this.author = {
              id: undefined,
              author_name: '',
              biography: '',
              author_photo: undefined,
            };
            this.photo = null
            this.photo_name = null;
          }
      });
  }

  hideDialog() {
      this.authorDialog = false;
      this.submitted = false;
  }

  saveAuthor() {
    this.viewportScroller.scrollToPosition([0,0])
      this.submitted = true;

      if (this.author.author_name?.trim()) {

        if (this.author.id) { //Si tiene id estoy actualizando.
            this.authorService.updateAuthor(this.author, this.photo).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Autor actualizado', life: 3000 });
                  this.refreshAuthors();
                },
                error: (err) => {
                  console.error('Error updating author:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error actualizando el autor',  life: 3000 });
                }
              });
        }

        else { //Si no tiene id estoy creando.
          this.authorService.createAuthor(this.author, this.photo).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Autor creado',  life: 3000 });
                this.refreshAuthors();
            },
            error: (error) => {
                console.error('Error creating author:', error);
                this.messageService.add({ severity: 'error', summary: 'Error creando el autor',  life: 3000 });
            }
          })
        }

        this.authorDialog = false;
        this.author = {
          id: undefined,
          author_name: '',
          biography: '',
          author_photo: undefined,
        };
        this.photo = null
        this.photo_name = null;
      }
  }

  onFileUpload(event: any) {
    this.photo = event.files[0]
    this.photo_name = event.files[0].name
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'La foto se ha subido correctamente' })
  }

  cleanPic() {
    this.photo = null
    this.photo_name = null
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