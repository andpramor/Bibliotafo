import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from "../../services/common/auth-service/auth.service";

@Injectable({
    providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private messageService: MessageService) {}
  
    canActivate(): boolean {
        if (this.authService.localRol() === 'manager') {
            return true;
        } else {
            this.messageService.add({severity:'error', summary: 'Sólo encargados', detail: 'Acceso denegado.', life: 3000 });
            this.router.navigate(['']);
            return false;
        }
    }
}