import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartResponseDto } from '../../cart/services/cart-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = '/api/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // View cart
  getCart(promoCode?: string): Observable<CartResponseDto> {
    const headers = this.getAuthHeaders();
    const url = promoCode ? `${this.baseUrl}/view?promoCode=${promoCode}` : `${this.baseUrl}/view`;
    return this.http.get<CartResponseDto>(url, { headers });
  }

  // Add item
  addItem(foodItemId: number, qty: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/add?foodItemId=${foodItemId}&qty=${qty}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  // Update item
  updateItem(foodItemId: number, qty: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.baseUrl}/update?foodItemId=${foodItemId}&qty=${qty}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  // Remove item
  removeItem(foodItemId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${foodItemId}`, { headers });
  }

  // Checkout 
  checkout(promoCode?: string): Observable<CartResponseDto> {
    const headers = this.getAuthHeaders();
    const url = promoCode ? `${this.baseUrl}/checkout?promoCode=${promoCode}` : `${this.baseUrl}/checkout`;
    return this.http.post<CartResponseDto>(url, {}, { headers });
  }
}
