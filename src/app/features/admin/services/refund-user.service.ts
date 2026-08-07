import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefundsUserService {
  private baseUrl = 'http://localhost:5209/api/refunds';

  constructor(private http: HttpClient) {}

  claimRefund(orderId: number, remarks: string, refundItem: string = 'all', imageFile?: File): Observable<any> {
    const formData = new FormData();
    formData.append('remarks', remarks);
    formData.append('refundItem', refundItem);   // ✅ new field
    if (imageFile) {
      formData.append('imageFile', imageFile);
    }
    return this.http.post(`${this.baseUrl}/claim/${orderId}`, formData);
  }
}