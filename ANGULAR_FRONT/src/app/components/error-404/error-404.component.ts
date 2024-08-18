import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-error-404',
  templateUrl: './error-404.component.html',
  styleUrl: './error-404.component.css',
  standalone: true,
  imports: [ButtonModule, RouterModule]
})
export class Error404Component {

}
