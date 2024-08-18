import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrl: './profile-menu.component.css',
  standalone: true,
  imports: [MenuModule, ButtonModule]
})
export class ProfileMenuComponent implements OnInit {
  items: MenuItem[] | undefined;

  ngOnInit() {
      this.items = [
          {
              label: 'Mi perfil',
              icon: 'pi pi-user',
              route: ''
          },
          {
              label: 'Cerrar sesión',
              icon: 'pi pi-sign-out',
              route: ''
          }
      ];
  }
}
