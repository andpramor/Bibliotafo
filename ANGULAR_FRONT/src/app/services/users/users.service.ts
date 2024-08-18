import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { api_url } from '../../helpers/Constants';
import { Observable } from 'rxjs';
import { MyUser } from '../../interfaces/MyUser';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private BASE_URL = api_url.url + 'accounts/'

  constructor(private httpClient: HttpClient) {}

  getClients(): Observable<MyUser[]> {
    return this.httpClient.get<MyUser[]>(this.BASE_URL + 'users/?rol=client')
  }

  createClient(newClient: MyUser, profile_picture: File | null): Observable<MyUser> {
    const formData: FormData = new FormData();

    formData.append('username', newClient.username);
    formData.append('password', newClient.password);
    if(newClient.first_name) {formData.append('first_name', newClient.first_name)}
    if(newClient.email) {formData.append('email', newClient.email)}
    if(newClient.dni) {formData.append('dni', newClient.dni)}
    if(newClient.address) {formData.append('address', newClient.address)}
    if(profile_picture) {formData.append('profile_picture', profile_picture);}

    return this.httpClient.post<MyUser>(this.BASE_URL + 'client_register/', formData, { withCredentials: true });
  }

  createStaff(newStaff: MyUser, profile_picture: File | null): Observable<MyUser> {
    const formData: FormData = new FormData();

    formData.append('username', newStaff.username);
    formData.append('password', newStaff.password);
    if(newStaff.first_name) {formData.append('first_name', newStaff.first_name)}
    if(newStaff.email) {formData.append('email', newStaff.email)}
    if(newStaff.dni) {formData.append('dni', newStaff.dni)}
    if(newStaff.address) {formData.append('address', newStaff.address)}
    if(profile_picture) {formData.append('profile_picture', profile_picture);}

    return this.httpClient.post<MyUser>(this.BASE_URL + 'staff_register/', formData, { withCredentials: true });
  }

  createManager(newManager: MyUser, profile_picture: File | null): Observable<MyUser> {
    const formData: FormData = new FormData();

    formData.append('username', newManager.username);
    formData.append('password', newManager.password);
    if(newManager.first_name) {formData.append('first_name', newManager.first_name)}
    if(newManager.email) {formData.append('email', newManager.email)}
    if(newManager.dni) {formData.append('dni', newManager.dni)}
    if(newManager.address) {formData.append('address', newManager.address)}
    if(profile_picture) {formData.append('profile_picture', profile_picture);}

    return this.httpClient.post<MyUser>(this.BASE_URL + 'manager_register/', formData, { withCredentials: true });
  }

  getMyUser(): Observable<MyUser>{
    return this.httpClient.get<MyUser>(this.BASE_URL + 'profile/')
  }

  getUserById(userId: number): Observable<MyUser>{
    return this.httpClient.get<MyUser>(this.BASE_URL + 'users/' + userId + '/')
  }

  updateMyUser(myUser: MyUser, profile_picture: File | null): Observable<MyUser>{
    const formData: FormData = new FormData();

    formData.append('username', myUser.username);
    if(myUser.password) {formData.append('password', myUser.password)}
    if(myUser.first_name) {formData.append('first_name', myUser.first_name)}
    if(myUser.email) {formData.append('email', myUser.email)}
    if(myUser.dni) {formData.append('dni', myUser.dni)}
    if(myUser.address) {formData.append('address', myUser.address)}
    if(profile_picture) {formData.append('profile_picture', profile_picture);}

    return this.httpClient.patch<MyUser>(this.BASE_URL + 'users/' + myUser.id + '/', formData, { withCredentials: true });
  }

  deleteMyUser(): Observable<void>{
    return this.httpClient.delete<void>(this.BASE_URL + 'users/', { withCredentials: true });
  }
}
