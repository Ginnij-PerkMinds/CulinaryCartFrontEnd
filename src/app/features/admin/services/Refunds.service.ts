import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTOs matching backend
export interface RefundDto {
  refundId: number;
  requestDate: string;
  username: string;
  address: string;
  phoneNo: string;
  finalAmount: number;
  refundAmount: number;
  refundStatus: string;
  remarks?: string;
  refundImage?: string;        // proof image path
  refundUserRemarks?: string; 
}
export interface OrderItemDto {
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  finalPrice: number;
}

export interface RefundDetailsDto extends RefundDto {
  orderId: number;
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
export class RefundsService {
  private apiUrl = 'http://localhost:5209/api/Refunds';

  constructor(private http: HttpClient) {}

  // Get all refunds
  getAllRefunds(): Observable<RefundDto[]> {
    return this.http.get<RefundDto[]>(`${this.apiUrl}/all`);
  }

  // Get refunds by status
  getRefundsByStatus(status: string): Observable<RefundDto[]> {
    return this.http.get<RefundDto[]>(`${this.apiUrl}/${status}`);
  }

  // Get refund details
  getRefundDetails(id: number): Observable<RefundDetailsDto> {
    return this.http.get<RefundDetailsDto>(`${this.apiUrl}/details/${id}`);
  }

  // Accept refund (optional remarks)
  // acceptRefund(id: number, remarks?: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/${id}/accept`, remarks || null);
  // }
  acceptRefund(id: number, refundAmount: number, remarks?: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${id}/accept`, 
    { refundAmount, remarks },   // ✅ send both
    { headers: { 'Content-Type': 'application/json' } }
  );
}


  // Reject refund (remarks required)
  // rejectRefund(id: number, remarks: string): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/${id}/reject`, remarks);
  // }
  rejectRefund(id: number, remarks: string) {
  return this.http.post(`/api/refunds/${id}/reject`, 
    { remarks },   // ✅ send JSON object
    { headers: { 'Content-Type': 'application/json' } } // ✅ ensure JSON header
  );
}

}
