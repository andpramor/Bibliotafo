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

import { PublishersService } from '../../services/publishers/publishers.service';
import { Publisher } from '../../interfaces/Publisher';

@Component({
  selector: 'app-publishers-crud',
  templateUrl: './publishers-crud.component.html',
  styleUrl: './publishers-crud.component.css',
  standalone: true,
  imports: [TableModule, DialogModule, RippleModule, ButtonModule, ToastModule, ToolbarModule, ConfirmDialogModule, InputTextModule, InputTextareaModule, CommonModule, FileUploadModule, DropdownModule, TagModule, RadioButtonModule, RatingModule, InputTextModule, FormsModule, InputNumberModule],
  providers: [MessageService, ConfirmationService, PublishersService]
})
export class PublishersCrudComponent implements OnInit {

  @ViewChild('dt') table: Table;
  
  publisherDialog: boolean = false;

  publishers!: Publisher[];

  publisher!: Publisher;

  selectedPublishers!: Publisher[] | null;

  submitted: boolean = false;

  constructor(private publisherService: PublishersService, private messageService: MessageService, private confirmationService: ConfirmationService, private viewportScroller: ViewportScroller) {}

  ngOnInit() {
    this.refreshPublishers()
  }

  refreshPublishers() {
    this.viewportScroller.scrollToPosition([0,0])
    this.publisherService.getPublishers().subscribe({
        next: (data) => {this.publishers = data}
    });
  }

  getSelectedIds() {
    return this.selectedPublishers!.map(publisher => publisher.id).filter(id => id !== undefined) as number[];
  }

  openNew() {
    this.viewportScroller.scrollToPosition([0,0])
      this.publisher = {
        publisher_name: ''
      };
      this.submitted = false;
      this.publisherDialog = true;
  }

  deleteSelectedPublishers() {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que desea eliminar las editoriales seleccionadas?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
              this.publisherService.deletePublishersList(this.getSelectedIds()).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Editoriales eliminadas', life: 3000 });
                  this.refreshPublishers();
                },
                error: (err) => {
                  console.error('Error deleting publishers:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error eliminando editoriales', life: 3000 });
                }
              });
              this.selectedPublishers = null;
          }
      });
  }

  editPublisher(publisher: Publisher) {
    this.viewportScroller.scrollToPosition([0,0])
      this.publisher = { ...publisher };
      this.publisherDialog = true;
  }

  deletePublisher(publisher: Publisher) {
    this.viewportScroller.scrollToPosition([0,0])
      this.confirmationService.confirm({
          message: '¿Seguro que quieres eliminar: "' + publisher.publisher_name + '"?',
          header: 'Confirmación',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          rejectLabel: 'No',
          accept: () => {
            this.publisherService.deletePublisher(publisher).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Editorial eliminada', life: 3000 });
                    this.refreshPublishers();
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Error borrando la editorial', life: 3000 });
                }
            })

            this.publisher = {
              publisher_name: ''
            };
          }
      });
  }

  hideDialog() {
      this.publisherDialog = false;
      this.submitted = false;
  }

  savePublisher() {
    this.viewportScroller.scrollToPosition([0,0])
      this.submitted = true;

      if (this.publisher.publisher_name?.trim()) {

        if (this.publisher.id) { //Si tiene id estoy actualizando.
            this.publisherService.updatePublisher(this.publisher).subscribe({
                next: () => {
                  this.messageService.add({ severity: 'success', summary: 'Editorial actualizada', life: 3000 });
                  this.refreshPublishers();
                },
                error: (err) => {
                  console.error('Error updating publisher:', err);
                  this.messageService.add({ severity: 'error', summary: 'Error actualizando la editorial',  life: 3000 });
                }
              });
        }

        else { //Si no tiene id estoy creando.
          this.publisherService.createPublisher(this.publisher).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Editorial creada',  life: 3000 });
                this.refreshPublishers();
            },
            error: (error) => {
                console.error('Error creating publisher:', error);
                this.messageService.add({ severity: 'error', summary: 'Error creando la editorial',  life: 3000 });
            }
          })
        }

        this.publisherDialog = false;
        this.publisher = {
          publisher_name: ''
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