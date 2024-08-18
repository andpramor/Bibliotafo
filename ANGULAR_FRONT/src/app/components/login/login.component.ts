import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { LoginRequest } from '../../interfaces/LoginRequest';
import { Router } from '@angular/router';
import { LoginResponse } from '../../interfaces/LoginResponse';
import { back_url } from '../../helpers/Constants';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SaleService } from '../../services/sale/sale.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [DialogModule, ButtonModule, InputTextModule, FormsModule, ToastModule],
  providers: [MessageService]
})
export class LoginComponent {
  
  visible: boolean = false;

  loginRequest:LoginRequest = {
    username: '',
    password: ''
  }

  constructor(private authService: AuthService, private router: Router, private messageService: MessageService, private saleService: SaleService, private viewportScroller: ViewportScroller){}

  showDialog() {
    this.viewportScroller.scrollToPosition([0,0])
    this.visible = true
  }

  closeDialog() {
    this.visible = false
  }

  login() {
    this.viewportScroller.scrollToPosition([0,0])
    this.authService.login(this.loginRequest).subscribe({
      next: (response: LoginResponse) => {
        localStorage.setItem('access_token', response.access)
        localStorage.setItem('user_rol', response.rol)
        localStorage.setItem('user_id', response.id.toString())
        this.authService.setLoggedIn(true)
        this.authService.setUserRol(response.rol)
        this.saleService.loadCartCount()

        if(response.profile) {
          this.authService.setProfilePic(back_url.url + response.profile)
          localStorage.setItem('profile_pic', back_url.url + response.profile)
        }

        if(response.sale) {
          localStorage.setItem('sale', response.sale)
        }

        console.log('Login successful', response)
        this.messageService.add({ severity: 'succes', summary: '¡Bienvenido!', life: 1500 })
        this.closeDialog()
      },
      error: (resp) => {
        console.log('Login failed. Error: ' + resp.error.message)
        this.messageService.add({ severity: 'error', summary: 'Error iniciando sesión', life: 1500 })
        setTimeout(()=>{this.router.navigate([''])},1500)
      }
    })
    
  }

}