import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RefundDto {
  refundId: number;
  requestDate: string;
  refundStatus: string;
  finalAmount: number;
  refundAmount: number;
  remarks?: string;
  refundImage?: string;
}

export interface OrderItemDto {
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  finalPrice: number;
}

export interface RefundItemDto {
  refundItemId: number;
  foodItemId: number;
  foodItemName: string;
  refundImage?: string;
  remarks?: string;
}

export interface RefundDetailsDto {
  refundId: number;
  requestDate: string;
  refundStatus: string;
  finalAmount: number;
  refundAmount: number;
  remarks?: string;
  refundImage?: string;
  orderId: number;
  orderItems: OrderItemDto[];
  refundItems: RefundItemDto[];
}

@Injectable({
  providedIn: 'root'
})
export class RefundsUserService {
  private baseUrl = 'http://localhost:5209/api/Refunds'; 

  constructor(private http: HttpClient) {}

claimRefund(formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/claim`, formData);
}

//  Get all refunds for the logged-in user
  getMyRefunds(): Observable<RefundDto[]> {
    return this.http.get<RefundDto[]>(`${this.baseUrl}/all`);
  }

  // Get details of a specific refund
  getRefundDetails(refundId: number): Observable<RefundDetailsDto> {
    return this.http.get<RefundDetailsDto>(`${this.baseUrl}/details/${refundId}`);
  }
}