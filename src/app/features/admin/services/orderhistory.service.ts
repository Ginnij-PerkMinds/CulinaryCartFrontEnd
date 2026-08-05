import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private baseUrl = 'http://localhost:5209/api'; 

  constructor(private http: HttpClient) {}

  // Get all order history for a user
  getOrderHistoryByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Cart/order-history/${userId}`);
  }

  // Get "My Orders" for a user
  getMyOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/Cart/my-orders`);
  }
}