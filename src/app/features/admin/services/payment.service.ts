import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentOrderDto } from '../model/payment-order.dto';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor(private http: HttpClient) {}

  createOrder(): Observable<PaymentOrderDto> {
  return this.http.post<PaymentOrderDto>('http://localhost:5209/api/payment/create-order', {});
 }
  verifyPayment(payload: any): Observable<any> {
    return this.http.post('http://localhost:5209/api/Payment/verify-payment', payload);
  }
  finalizeCheckout(): Observable<any> {
  return this.http.post('http://localhost:5209/api/payment/finalize-checkout', {});
 }
}