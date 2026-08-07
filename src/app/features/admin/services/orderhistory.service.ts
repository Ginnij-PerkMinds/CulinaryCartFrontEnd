import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MyOrderDto {
  orderId: number;
  orderDate: string;
  finalAmount: number;
  orderStatus: string;
  appliedPromoCode?: string;
  remarks?: string;
  refundStatus?: string;
  refundImage?: string;
  refundUserRemarks?: string;
}

export interface MyOrderItemDto {
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  finalPrice: number;
}

export interface MyOrderDetailsDto {
  orderId: number;
  orderDate: string;
  baseAmount: number;
  promoDiscount: number;
  handlingFee: number;
  deliveryFee: number;
  taxAmount: number;
  finalAmount: number;
  orderStatus: string;
  appliedPromoCode?: string;
  remarks?: string;
  refundStatus?: string;
  refundImage?: string;
  refundUserRemarks?: string;
  orderItems: MyOrderItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {
  private baseUrl = 'http://localhost:5209/api'; 

  constructor(private http: HttpClient) {}

  // Get all order history for a user
  getOrderHistoryByUserId(userId: number): Observable<MyOrderDto[]> {
    return this.http.get<MyOrderDto[]>(`${this.baseUrl}/Cart/order-history/${userId}`);
  }

  // Get "My Orders" for a user
  getMyOrders(): Observable<MyOrderDto[]> {
    return this.http.get<MyOrderDto[]>(`${this.baseUrl}/MyOrders/all`);
  }

 getMyOrdersDetails(orderId: number): Observable<MyOrderDetailsDto> {
  return this.http.get<MyOrderDetailsDto>(`${this.baseUrl}/MyOrders/details/${orderId}`);
 }
}