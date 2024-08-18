import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from "../../services/common/auth-service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class LogedInGuard implements CanActivate {
  
    constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}
  
    canActivate(): boolean {
        if (this.authService.hasToken()) {
            return true;
        } else {
            this.messageService.add({severity:'error', summary: 'Acceso Denegado', detail: 'Tienes que iniciar sesión primero.', life: 3000 });
            this.router.navigate(['']);
            return false;
        }
    }
}