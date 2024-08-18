import { Component, OnInit } from '@angular/core';
import { ReviewsService } from '../../services/reviews/reviews.service';
import { Review } from '../../interfaces/Review';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { back_url } from '../../helpers/Constants';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule, AvatarModule, ConfirmDialogModule, FormsModule, InputTextareaModule, ToastModule],
  providers: [ConfirmationService, MessageService]
})
export class ReviewsListComponent implements OnInit {

  reviews: Review[]
  user: number
  book: number
  book_view: boolean
  base_url: string = back_url.url
  active_user: number
  own_review: Review | undefined
  new_review: Review = {
    user: 0,
    book: 0,
    comment: ''
  }

  constructor(private reviewsService: ReviewsService, private router: Router, private route: ActivatedRoute, private confirmationService: ConfirmationService, private messageService: MessageService, private viewportScroller: ViewportScroller){}
  
  ngOnInit(): void {
    this.active_user = Number(localStorage.getItem('user_id'))!
    this.reloadReviews()
  }

  reloadReviews(){
    this.viewportScroller.scrollToPosition([0,0])
    if(this.router.url.includes('usuario')){
      this.book_view = false
      this.user = this.route.snapshot.params['id']
      this.reviewsService.getReviewsByUser(this.user).subscribe({
        next: (response) => {
          this.reviews = response
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    } else {
      this.book_view = true
      this.book = this.route.snapshot.params['id']
      this.new_review.book = this.book
      this.new_review.user = this.active_user

      this.reviewsService.getReviewsByBook(this.book).subscribe({
        next: (response) => {
          this.reviews = response
          this.own_review = this.reviews.find(review => review.user === this.active_user)
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    }
  }

  publishReview(new_review: Review){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Listo para publicar tu reseña?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.reviewsService.addReview(new_review.user, new_review.book, new_review.comment).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Reseña publicada', life: 3000 });
            this.reloadReviews()
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error añadiendo la reseña', life: 3000 });
            console.log('Error: ', error)
          }
        })
      }
    })
  }

  delReview(review: Review){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres eliminar tu reseña de ' + review.book_title + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.reviewsService.deleteReview(review.id!).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Reseña eliminada', life: 3000 });
            this.reloadReviews()
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error eliminando la reseña', life: 3000 });
            console.log('Error: ', error)
          }
        })
      }
    })
  }
}
