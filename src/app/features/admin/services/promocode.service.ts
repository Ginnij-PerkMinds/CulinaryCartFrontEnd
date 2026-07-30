import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Promocode {
  id?: number;              
  promoCodeName: string;
  amount: number | string;
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
  addPromocode(promo: Promocode): Observable<{ success: boolean, message: string }> {
    return this.http.post<{ success: boolean, message: string }>(`${this.apiUrl}/AddPromocode`, promo);
  }

  // PUT update promocode
  updatePromocode(id: number, promo: Promocode): Observable<{ success: boolean, message: string }> {
    return this.http.put<{ success: boolean, message: string }>(`${this.apiUrl}/UpdatePromocode/${id}`, promo);
  }

  // DELETE promocode
  deletePromocode(id: number): Observable<{ success: boolean, message: string }> {
    return this.http.delete<{ success: boolean, message: string }>(`${this.apiUrl}/DeletePromocode/${id}`);
  }
}