import { Component, Input } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from '../../services/common/auth-service/auth.service';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  providers: [MessageService]
})
export class LogoutComponent {

  @Input() item: MenuItem | undefined;
  
  visible: boolean = false

  constructor(private authService: AuthService, private messageService: MessageService, private viewportScroller: ViewportScroller){}

  showDialog() {
    this.visible = true
  }

  logout(){
    this.viewportScroller.scrollToPosition([0,0])
    this.messageService.add({ severity: 'success', summary: '¡Hasta pronto!', life: 3000 })
    this.authService.logout()
  }

}
