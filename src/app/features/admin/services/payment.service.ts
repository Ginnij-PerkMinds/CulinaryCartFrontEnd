import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

 createOrder(finalAmount: number): Observable<any> {
    return this.http.post('http://localhost:5209/api/cart/checkout', { finalAmount });
  }

  verifyPayment(payload: any): Observable<any> {
    return this.http.post('http://localhost:5209/api/Payment/verify-payment', payload);
  }
}