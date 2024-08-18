import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RatingService } from '../../services/rating/rating.service';
import { Rating } from '../../interfaces/Rating';
import { CommonModule } from '@angular/common';
import { back_url } from '../../helpers/Constants';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-ratings-list',
  templateUrl: './ratings-list.component.html',
  styleUrl: './ratings-list.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RatingModule]
})
export class RatingsListComponent implements OnInit {
  
  base_url: string = back_url.url

  ratings: Rating[]

  constructor(private ratingService: RatingService, private route: ActivatedRoute){}

  ngOnInit(): void {
      this.ratingService.getRatingsByUser(this.route.snapshot.params['id']).subscribe({
        next: (response) => {
          this.ratings = response
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
  }
}
