import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RefundDto {
  refundId: number;
  requestDate: string;
  refundStatus: string;
  finalAmount: number;
  remarks?: string;
  refundImage?: string;
}

export interface RefundDetailsDto {
  refundId: number;
  requestDate: string;
  refundStatus: string;
  finalAmount: number;
  remarks?: string;
  refundImage?: string;
  orderId: number;
  orderItems: {
    foodItemId: number;
    foodItemName: string;
    quantity: number;
    finalPrice: number;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class RefundsUserService {
  private baseUrl = 'http://localhost:5209/api/Refunds'; 

  constructor(private http: HttpClient) {}

  
  claimRefund(orderId: number, remarks: string, itemId: number | null, proofFile?: File): Observable<any> {
  const formData = new FormData();
  formData.append('OrderId', orderId.toString());
  if (remarks) {
    formData.append('Remarks', remarks);
  }

  if (itemId !== null) {
    formData.append('ItemId', itemId.toString()); 
  }

  if (proofFile) {
    formData.append('ProofFile', proofFile, proofFile.name);
  }

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