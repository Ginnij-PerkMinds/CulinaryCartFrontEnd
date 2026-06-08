import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MenuItem, MenuResponse } from '../model/menu-item.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = '/api/Menu/ShowMenu?PageNumber=1&PageSize=41';

  constructor(private http: HttpClient) {}

  // Get all menu items
  getMenu(): Observable<MenuResponse> {
    return this.http.get<MenuResponse>(this.apiUrl);
  }
}


