import { Component, OnInit } from '@angular/core';
import { MyUser } from '../../interfaces/MyUser';
import { UsersService } from '../../services/users/users.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { back_url } from '../../helpers/Constants';
import { ButtonModule } from 'primeng/button';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { FriendsService } from '../../services/friends/friends.service';
import { Friendship } from '../../interfaces/Friendship';
import { FavouritesService } from '../../services/favourites/favourites.service';
import { Favourite } from '../../interfaces/Favourite';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ButtonModule, ToastModule, RouterModule],
  providers: [ConfirmationService, MessageService]
})
export class UserProfileComponent implements OnInit {
  
  base_url: string = back_url.url
  own: boolean = false
  status: string = 'no'

  myUser: MyUser = {
    id: undefined,
    username: '',
    email: '',
    password: '',
    rol: '',
    first_name: '',
    address: '',
    profile_picture: ''
  }

  friends: Friendship[] = []
  friendsIds: Number[] = []
  sentFriends: Friendship[] = []
  sentIds: Number[] = []
  receivedFriends: Friendship[] = []
  receivedIds: Number[] = []
  friendship: Friendship

  favourites: Favourite[]

  constructor(private userService: UsersService, private router: Router, private route: ActivatedRoute, private messageService: MessageService, private confirmationService: ConfirmationService, private authService: AuthService, private friendsService: FriendsService, private favouritesService: FavouritesService, private viewportScroller: ViewportScroller){}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0,0])
    if(this.router.url.includes('/miperfil')) {

      this.own = true

      this.userService.getMyUser().subscribe({
        next: (response) => {
          this.myUser = response
          this.reloadData()
        },
        error: (error) => {
          console.log('Error: ', error)
        }
      })

      this.reloadFriendships()

    } else {

      if(localStorage.getItem('user_id')==this.route.snapshot.params['id']){
        this.router.navigate(['/miperfil'])
      } else {
        this.userService.getUserById(this.route.snapshot.params['id']).subscribe({
          next: (response) => {
            this.myUser = response
            this.reloadData()
            this.reloadFriendships()
          },
          error: (error) => {
            console.log('Error: ', error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No tienes permiso para ver este perfil.' })
            setTimeout(() => {this.router.navigate([''])}, 1000)
          }
        })
      }
    }
  }

  reloadFriendships(){
    this.friendsService.getFriends().subscribe({
      next: (response) => {
        this.friends = response

        const foundFriendship = response.find(friendship => friendship.friend.id === Number(this.route.snapshot.params['id']));
        if(foundFriendship){
          this.status = 'yes';
          this.friendship = foundFriendship;
        }
      },
      error: (error) => {
        console.log('Error: ', error)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error recuperando amistades.' })
      }
    })

    this.friendsService.getSent().subscribe({
      next: (response) => {
        this.sentFriends = response
        
        const foundFriendship = response.find(friendship => friendship.friend.id === Number(this.route.snapshot.params['id']));
        if(foundFriendship){
          this.status = 'sent';
          this.friendship = foundFriendship;
        }
      },
      error: (error) => {
        console.log('Error: ', error)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error recuperando amistades.' })
      }
    })

    this.friendsService.getReceived().subscribe({
      next: (response) => {
        this.receivedFriends = response
        
        const foundFriendship = response.find(friendship => friendship.friend.id === Number(this.route.snapshot.params['id']));
        if(foundFriendship){
          this.status = 'received';
          this.friendship = foundFriendship;
        }
      },
      error: (error) => {
        console.log('Error: ', error)
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error recuperando amistades.' })
      }
    })
  }

  reloadData(){
    this.favouritesService.getFavouritesByUser(this.myUser.id!).subscribe({
      next:(response)=>{
        this.favourites = response
      },
      error:(error)=>{
        console.log('Error: ',error),
        console.log(this.myUser)
        this.messageService.add({ severity: 'error', summary: 'Error cargando favoritos', life: 1500 })
      }
    })
  }

  profile(user_id: number){
    this.router.navigate(['usuario/'+user_id])
  }

  accept(friendship: Friendship){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres aceptar la petición de ' + friendship.friend.username + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.friendsService.acceptRequest(friendship.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Petición aceptada', life: 1500 })
              this.reloadFriendships()
              if(!this.router.url.includes('/miperfil')){
                setTimeout(()=>{this.router.navigate(['miperfil'])},1500)
              }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error al aceptar la petición', life: 1500 })
                console.log('Error: ',error)
            }
        })
      }
    })
  }

  reject(friendship: Friendship){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres rechazar la petición de ' + friendship.friend.username + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.friendsService.rejectRequest(friendship.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Petición rechazada', life: 1500 })
              this.reloadFriendships()
              if(!this.router.url.includes('/miperfil')){
                setTimeout(()=>{this.router.navigate(['miperfil'])},1500)
              }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error eliminando la petición', life: 1500 })
                console.log('Error: ',error)
            }
        })
      }
    })
  }

  cancel(friendship: Friendship){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres cancelar tu petición a ' + friendship.friend.username + '?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.friendsService.deleteFriend(friendship.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Petición cancelada', life: 1500 })
              this.reloadFriendships()
              if(!this.router.url.includes('/miperfil')){
                setTimeout(()=>{this.router.navigate(['miperfil'])},1500)
              }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error cancelando la petición', life: 1500 })
                console.log('Error: ',error)
            }
        })
      }
    })
  }

  deleteFriendship(friendship: Friendship){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres eliminar a ' + friendship.friend.username + ' de tu lista de amigos?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.friendsService.deleteFriend(friendship.id).subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Amigo eliminado', life: 1500 })
              this.reloadFriendships()
              if(!this.router.url.includes('/miperfil')){
                setTimeout(()=>{this.router.navigate(['miperfil'])},1500)
              }
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error eliminando al amigo', life: 1500 })
                console.log('Error: ',error)
            }
        })
      }
    })
  }

  deleteUser(){
    this.viewportScroller.scrollToPosition([0,0])
    this.confirmationService.confirm({
      message: '¿Seguro que quieres eliminar tu cuenta?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.userService.deleteMyUser().subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Cuenta eliminada', life: 1000 })
              setTimeout(()=>{this.authService.logout()}, 1000)
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error eliminando la cuenta', life: 3000 })
                console.log('Error: ',error)
            }
        })
      }
    })
  }

  ask(){
    this.viewportScroller.scrollToPosition([0,0])
    this.friendsService.sendRequest(this.route.snapshot.params['id']).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Petición enviada', life: 1000 })
        setTimeout(()=>{this.router.navigate([''])}, 1000)
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Petición fallida', life: 1000 })
        console.log('Error: ', error)
      }
    })
  }

  cancelOut(){
    this.cancel(this.friendship)
  }

  acceptOut(){
    this.accept(this.friendship)
  }

  ignoreOut(){
    this.reject(this.friendship)
  }

  deleteOut(){
    this.deleteFriendship(this.friendship)
  }
}