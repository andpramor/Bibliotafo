import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';

import { MyUser } from '../../interfaces/MyUser';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { UsersService } from '../../services/users/users.service';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectButtonModule } from 'primeng/selectbutton';
import { back_url } from '../../helpers/Constants';

@Component({
  selector: 'app-create-update-account',
  templateUrl: './create-update-account.component.html',
  styleUrl: './create-update-account.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, PasswordModule, FloatLabelModule, ToastModule, FileUploadModule, ButtonModule, SelectButtonModule, RippleModule],
  providers: [MessageService]
})
export class CreateUpdateAccountComponent implements OnInit {

  logedIn: boolean = false
  use: string
  workOptions: any[] = [{ label: 'Trabajador', value: 'staff' },{ label: 'Encargado', value: 'manager' }];
  workValue: string = 'staff';

  myUser: MyUser = {
    id: undefined,
    username: '',
    password: '',
    email: '',
    profile_picture: undefined,
    dni: undefined,
    first_name: undefined,
    address: undefined,
    rol: ''
  }

  new_password: string = ''
  new_password2: string = ''
  //If new_password != new_password2 cascar

  profile_picture: File | null = null;
  profile_picture_name: string | null;

  constructor(private userService: UsersService, private authService: AuthService, private messageService: MessageService, private router: Router, private viewportScroller: ViewportScroller){}

  ngOnInit() {
    this.viewportScroller.scrollToPosition([0,0])
    if(this.router.url.includes('/cuenta')) {
      this.use = 'own'
      this.authService.getLoginStatus().subscribe({
        next: (response) => {
          this.logedIn = response //Si estamos logeados, estamos editando, cargo el usuario:
          if (response){
            this.userService.getMyUser().subscribe({
              next: (user) => {
                this.myUser = user
              }
            })
          }
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    } else if(this.router.url.includes('/nuevo_trabajador')) {
      this.logedIn = true
      this.use = 'work'
    }
  }

  onFileUpload(event: any) {
    this.viewportScroller.scrollToPosition([0,0])
    this.profile_picture = event.files[0]
    this.profile_picture_name = event.files[0].name
    this.messageService.add({ severity: 'info', summary: 'Éxito', detail: 'La foto se ha subido correctamente' })
  }

  cleanPic() {
    this.profile_picture = null
    this.profile_picture_name = null
  }

  register() {
    this.viewportScroller.scrollToPosition([0,0])
    if(this.myUser.username.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio' })
    } else if (this.myUser.password == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña es obligatoria' })
    } else if (this.myUser.email.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El correo es obligatorio' })
    } else {
      this.userService.createClient(this.myUser, this.profile_picture).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: '¡Gracias!', detail: 'Te has registrado con éxito' })
          setTimeout(() => {this.router.navigate([''])}, 600)
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    }
  }

  update(){
    this.viewportScroller.scrollToPosition([0,0])
    if(this.myUser.username.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio' })
    } else if (this.new_password != '' && this.new_password != this.new_password2){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden' })
    } else if (this.myUser.email.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El correo es obligatorio' })
    } else {
      if(this.new_password != '') {
        this.myUser.password = this.new_password
      }
      this.userService.updateMyUser(this.myUser, this.profile_picture).subscribe({
        next: (response) => {
          this.messageService.add({ severity: 'success', summary: '¡Correcto!', detail: 'Se han guardado los cambios' })
          this.authService.setProfilePic(back_url.url + response.profile_picture)
          setTimeout(() => {this.router.navigate([''])}, 600)
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })
    }    
  }

  register_work(){
    this.viewportScroller.scrollToPosition([0,0])
    if(this.myUser.username.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El nombre de usuario es obligatorio' })
    } else if (this.myUser.password == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'La contraseña es obligatoria' })
    } else if (this.myUser.email.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El correo es obligatorio' })
    } else if(this.workValue.trim() == ''){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El rol es obligatorio' })
    } else {
      if(this.workValue.trim() == 'staff') {
        this.userService.createStaff(this.myUser, this.profile_picture).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: '¡Gracias!', detail: 'Trabajador registrado con éxito' })
            setTimeout(() => {this.router.navigate([''])}, 600)
          },
          error: (error) => {
            console.log('Error: ', error)
          }
        })
      } else if(this.workValue.trim() == 'manager') {
        this.userService.createManager(this.myUser, this.profile_picture).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: '¡Gracias!', detail: 'Trabajador registrado con éxito' })
            setTimeout(() => {this.router.navigate([''])}, 600)
          },
          error: (error) => {
            console.log('Error: ', error)
          }
        })
      }
    }
  }
}
