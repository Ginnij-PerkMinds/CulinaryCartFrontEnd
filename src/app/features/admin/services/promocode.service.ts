import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocode {
  id?: number;              // optional for POST
  promoCodeName: string;
  amount?: number;
  criteria: number;
  freeDelivery: boolean;
  usageCount?: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PromocodeService {
  private apiUrl = 'http://localhost:5209/api/Promocode';

  constructor(private http: HttpClient) {}

  // GET all promocodes
  getPromocodes(): Observable<Promocode[]> {
    return this.http.get<Promocode[]>(`${this.apiUrl}/GetPromocodes`);
  }

  // GET single promocode
  getPromocode(id: number): Observable<Promocode> {
    return this.http.get<Promocode>(`${this.apiUrl}/GetPromocode/${id}`);
  }

  // POST add promocode
  addPromocode(promo: Promocode): Observable<Promocode> {
    return this.http.post<Promocode>(`${this.apiUrl}/AddPromocode`, promo);
  }

  // PUT update promocode
  updatePromocode(id: number, promo: Promocode): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/UpdatePromocode/${id}`, promo);
  }

  // DELETE promocode
  deletePromocode(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/DeletePromocode/${id}`);
  }
}
