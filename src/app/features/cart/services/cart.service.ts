import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  // ✅ View cart
  getCart(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(`${this.baseUrl}/ViewCart`, { headers });
  }

  // ✅ Add item
  addItem(foodItemId: number, qty: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(
      `${this.baseUrl}/add?foodItemId=${foodItemId}&qty=${qty}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  // ✅ Update item
  updateItem(foodItemId: number, qty: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(
      `${this.baseUrl}/update?foodItemId=${foodItemId}&qty=${qty}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  // ✅ Remove item
  removeItem(foodItemId: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.baseUrl}/delete/${foodItemId}`, { headers });
  }

  // ✅ Checkout (you’ll need to add this endpoint in backend if not present)
  checkout(cartItems: any[]): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.baseUrl}/checkout`, cartItems, { headers });
  }
}

