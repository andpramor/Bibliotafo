import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { api_url } from '../../helpers/Constants';
import { Publisher } from '../../interfaces/Publisher';

@Injectable({
  providedIn: 'root'
})
export class PublishersService {

  private BASE_URL = api_url.url + 'shop/publishers/'

  constructor(private httpClient: HttpClient) {}

  getPublishers(): Observable<Publisher[]> {
    return this.httpClient.get<Publisher[]>(this.BASE_URL)
  }

  createPublisher(newPublisher: Publisher): Observable<Publisher> {
    return this.httpClient.post<Publisher>(this.BASE_URL, newPublisher, { withCredentials: true });
  }

  updatePublisher(publisher: Publisher): Observable<void> {
    return this.httpClient.put<void>(this.BASE_URL + publisher.id + '/', publisher, { withCredentials: true });
  }

  deletePublisher(publisher: Publisher): Observable<void> {
    return this.httpClient.delete<void>(this.BASE_URL + publisher.id + '/', { withCredentials: true });
  }

  /**
   * Aquí utilizaré request<void> e indico el método http delete
   * porque usar httpClient.delete no permite incluir un body,
   * y necesito pasar el listado de las editoriales a eliminar.
   */
  deletePublishersList(publisherIds: number[]): Observable<void> {
    return this.httpClient.request<void>('delete', api_url.url + 'shop/bulk_delete_publishers/', {
      withCredentials: true,
      body: { ids: publisherIds }
    });
  }

}
