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

import { ThemesService } from '../../services/themes/themes.service';
import { Theme } from '../../interfaces/Theme';

@Component({
  selector: 'app-themes-crud',
  templateUrl: './themes-crud.component.html',
  styleUrl: './themes-crud.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, ThemesService]
})
export class ThemesCrudComponent implements OnInit {

  @ViewChild('dt') table: Table;
  
  themeDialog: boolean = false;

  themes!: Theme[];

  theme!: Theme;

  selectedThemes!: Theme[] | null;

  submitted: boolean = false;

  constructor(private themeService: ThemesService, private messageService: MessageService, private confirmationService: ConfirmationService, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.refreshThemes()
  }

  refreshThemes() {
    this.viewportScroller.scrollToPosition([0,0])
    this.themeService.getThemes().subscribe({
        next: (data) => {this.themes = data}
    });
  }

  getSelectedIds() {
    return this.selectedThemes!.map(theme => theme.id).filter(id => id !== undefined) as number[];
  }

  openNew() {
    this.viewportScroller.scrollToPosition([0,0])
    this.theme = {
      theme_name: ''
    };
    this.submitted = false;
    this.themeDialog = true;
  }

  deleteSelectedThemes() {
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
        message: '¿Seguro que desea eliminar los temas seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
            this.themeService.deleteThemesList(this.getSelectedIds()).subscribe({
              next: () => {
                this.messageService.add({ severity: 'success', summary: 'Temas eliminados', life: 3000 });
                this.refreshThemes();
              },
              error: (err) => {
                console.error('Error deleting themes:', err);
                this.messageService.add({ severity: 'error', summary: 'Error eliminando temas', life: 3000 });
              }
            });
            this.selectedThemes = null;
        }
    });
  }

  editTheme(theme: Theme) {
    this.viewportScroller.scrollToPosition([0,0])
    this.theme = { ...theme };
    this.themeDialog = true;
  }

  deleteTheme(theme: Theme) {
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
        message: '¿Seguro que quieres eliminar: "' + theme.theme_name + '"?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        accept: () => {
          this.themeService.deleteTheme(theme).subscribe({
              next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Tema eliminado', life: 3000 });
                  this.refreshThemes();
              },
              error: (error) => {
                console.error('Error updating theme:', error);
                  this.messageService.add({ severity: 'error', summary: 'Error borrando el tema', life: 3000 });
              }
          })

          this.theme = {
            theme_name: ''
          };
        }
    });
  }

  hideDialog() {
      this.themeDialog = false;
      this.submitted = false;
  }

  saveTheme() {
    this.viewportScroller.scrollToPosition([0,0])
      this.submitted = true;

      if (this.theme.theme_name?.trim()) {

        if (this.theme.id) { //Si tiene id estoy actualizando.
            this.themeService.updateTheme(this.theme).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Tema actualizado', life: 3000 });
                  this.refreshThemes();
                },
                error: (err) => {
                  console.error('Error updating theme:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error actualizando el tema',  life: 3000 });
                }
              });
        }

        else { //Si no tiene id estoy creando.
          this.themeService.createTheme(this.theme).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Tema creado',  life: 3000 });
                this.refreshThemes();
            },
            error: (error) => {
                console.error('Error creating theme:', error);
                this.messageService.add({ severity: 'error', summary: 'Error creando el tema',  life: 3000 });
            }
          })
        }

        this.themeDialog = false;
        this.theme = {
          theme_name: ''
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