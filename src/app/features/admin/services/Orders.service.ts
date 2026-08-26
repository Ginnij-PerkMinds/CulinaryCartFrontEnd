import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrderDto {
  orderId: number;
  orderDate: string;
  username: string;
  address: string;
  phoneNo: string;
  finalAmount: number;
  orderStatus: string;
  appliedPromoCode: string;
  remarks?: string;
}

export interface OrderItemDto {
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  finalPrice: number;
}

export interface OrderDetailsDto extends OrderDto {
  baseAmount: number;
  promoDiscount: number;
  handlingFee: number;
  deliveryFee: number;
  taxAmount: number;
  orderItems: OrderItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:5209/api/orders';

  constructor(private http: HttpClient) {}

  getAllOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/all`);
  }

  getOrdersByStatus(status: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/${status.toLowerCase()}`);
  }

  getOrderDetails(id: number): Observable<OrderDetailsDto> {
    return this.http.get<OrderDetailsDto>(`${this.apiUrl}/details/${id}`);
  }

  acceptOrder(id: number, remarks?: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/accept`, remarks);
  }

  rejectOrder(orderId: number, remarks: string) {
  return this.http.post(`/api/orders/${orderId}/reject`, 
    { remarks },   // send as JSON object
    { headers: { 'Content-Type': 'application/json' } }
  );
}

  markDelivered(orderId: number, remarks: string = ''): Observable<any> {
  return this.http.post(`${this.apiUrl}/${orderId}/delivered`, remarks, {
    headers: { 'Content-Type': 'application/json' }
  });
  } 
}