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

import { GenresService } from '../../services/genres/genres.service';
import { Genre } from '../../interfaces/Genre';

@Component({
  selector: 'app-genres-crud',
  templateUrl: './genres-crud.component.html',
  styleUrl: './genres-crud.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, GenresService]
})
export class GenresCrudComponent implements OnInit {

  @ViewChild('dt') table: Table;

  genreDialog: boolean = false;

  genres!: Genre[];

  genre!: Genre;

  selectedGenres!: Genre[] | null;

  submitted: boolean = false;

  constructor(private genreService: GenresService, private messageService: MessageService, private confirmationService: ConfirmationService, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.refreshGenres()
  }

  refreshGenres() {
    this.viewportScroller.scrollToPosition([0,0])
    this.genreService.getGenres().subscribe({
        next: (data) => {this.genres = data}
    });
  }

  getSelectedIds() {
    return this.selectedGenres!.map(genre => genre.id).filter(id => id !== undefined) as number[];
  }

  openNew() {
    this.viewportScroller.scrollToPosition([0,0])
    this.genre = {
      genre_name: ''
    };
    this.submitted = false;
    this.genreDialog = true;
  }

  deleteSelectedGenres() {
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
        message: '¿Seguro que desea eliminar los géneros seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
            this.genreService.deleteGenresList(this.getSelectedIds()).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Géneros eliminados', life: 3000 });
                this.refreshGenres();
              },
              error: (err) => {
                console.error('Error deleting genres:', err);
                this.messageService.add({ severity: 'error', summary: 'Error eliminando géneros', life: 3000 });
              }
            });
            this.selectedGenres = null;
        }
    });
  }

  editGenre(genre: Genre) {
    this.viewportScroller.scrollToPosition([0,0])
    this.genre = { ...genre };
    this.genreDialog = true;
  }

  deleteGenre(genre: Genre) {
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
        message: '¿Seguro que quieres eliminar: "' + genre.genre_name + '"?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.genreService.deleteGenre(genre).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Género eliminado', life: 3000 });
                  this.refreshGenres();
              },
              error: (error) => {
                console.error('Error updating genre:', error);
                  this.messageService.add({ severity: 'error', summary: 'Error borrando el género', life: 3000 });
              }
          })

          this.genre = {
            genre_name: ''
          };
        }
    });
  }

  hideDialog() {
      this.genreDialog = false;
      this.submitted = false;
  }

  saveGenre() {
    this.viewportScroller.scrollToPosition([0,0])
    this.submitted = true;

    if (this.genre.genre_name?.trim()) {

      if (this.genre.id) { //Si tiene id estoy actualizando.
          this.genreService.updateGenre(this.genre).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Género actualizado', life: 3000 });
                this.refreshGenres();
              },
              error: (err) => {
                console.error('Error updating genre:', err);
                this.messageService.add({ severity: 'error', summary: 'Error actualizando el género',  life: 3000 });
              }
            });
      }

      else { //Si no tiene id estoy creando.
        this.genreService.createGenre(this.genre).subscribe({
          next: () => {
              this.messageService.add({ severity: 'success', summary: 'Género creado',  life: 3000 });
              this.refreshGenres();
          },
          error: (error) => {
              console.error('Error creating genre:', error);
              this.messageService.add({ severity: 'error', summary: 'Error creando el género',  life: 3000 });
          }
        })
      }

      this.genreDialog = false;
      this.genre = {
        genre_name: ''
      };
    }
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