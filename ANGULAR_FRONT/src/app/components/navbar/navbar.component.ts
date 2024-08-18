import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';


import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { SaleService } from '../../services/sale/sale.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  standalone: true,
  imports: [MenubarModule, BadgeModule, AvatarModule, ButtonModule, InputTextModule, RippleModule, CommonModule, LoginComponent, LogoutComponent, ProfileMenuComponent, MenuModule]
})
export class NavbarComponent implements OnInit {
    isLoggedIn: boolean;
    inCart: number;
    hasProfilePic: boolean;
    userRol: string | null;
    profilePicUrl: string | null;

    constructor(private authService: AuthService, private saleService: SaleService) {}

    itemsNav: MenuItem[] | undefined;
    itemsPic: MenuItem[] | undefined;

    ngOnInit() {
        this.saleService.getInCart().subscribe(inCart => {
            this.inCart = inCart
            this.loadItems()
        })

        this.authService.getLoginStatus().subscribe(loggedIn => {
            this.isLoggedIn = loggedIn
            this.loadItems()
            this.updateProfileMenuItems()
        });

        this.authService.getUserRol().subscribe(rol => {
            this.userRol = rol
            this.loadItems();
        })

        this.authService.getProfilePic().subscribe(picurl => {
            this.hasProfilePic = !!picurl
            this.profilePicUrl = picurl
        });

    }

    loadItems() {
        this.itemsNav = [
            {
                label: 'Catálogo',
                icon: 'pi pi-book',
                route: 'libros'
            },
            {
                label: 'Autores',
                icon: 'pi pi-user',
                route: 'autores'
            },
            {
                label: 'Tus compras',
                icon: 'pi pi-shopping-cart',
                route: 'historial',
                visible: this.userRol === 'client'
            },
            {
                label: 'Ventas',
                icon: 'pi pi-shopping-cart',
                route: 'historial',
                visible: this.userRol === 'manager' || this.userRol === 'staff'
            },
            {
                label: 'Gestión',
                icon: 'pi pi-server',
                route: 'editoriales',
                visible: this.userRol === 'manager',
                items: [
                    {
                        label: 'Editoriales',
                        icon: 'pi pi-star',
                        route: 'editoriales'
                    },
                    {
                        label: 'Géneros',
                        icon: 'pi pi-star',
                        route: 'generos'
                    },
                    {
                        label: 'Temas',
                        icon: 'pi pi-star',
                        route: 'temas'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Registrar trabajador',
                        icon: 'pi pi-user-plus',
                        route: 'nuevo_trabajador'
                    }
                ]
            },
            {
                label: 'Carrito',
                icon: 'pi pi-shopping-cart',
                badge: this.inCart > 0 ? this.inCart.toString() : undefined,
                visible: this.userRol === 'client',
                route: 'carrito'
            },
            {
                label: 'Venta en curso',
                icon: 'pi pi-shopping-cart',
                badge: this.inCart > 0 ? this.inCart.toString() : undefined,
                visible: this.userRol === 'manager' || this.userRol === 'staff',
                route: 'carrito'
            }
        ];
    }

    updateProfileMenuItems(){
        this.itemsPic = [
            {
                label: 'Mi perfil',
                icon: 'pi pi-user',
                route: 'miperfil'
            },
            {
                label: 'Editar mis datos',
                icon: 'pi pi-user',
                route: 'cuenta'
            },
            {
                label: 'Cerrar sesión',
                icon: 'pi pi-sign-out',
                isLogoutComponent: true
            }
        ];
    }

    handleLogoutClick(event: Event) {
        event.stopPropagation();
    }
}
