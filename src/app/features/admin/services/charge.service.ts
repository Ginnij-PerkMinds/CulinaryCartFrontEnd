import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChargeDto } from '../model/charge.dto';
import { AddChargeRequest, UpdateChargeRequest } from '../model/charge.dto';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {
  private apiUrl = 'http://localhost:5209/api/charge'; 

  constructor(private http: HttpClient) {}

  // Get all charges
  getAllCharges(): Observable<ChargeDto[]> {
    return this.http.get<ChargeDto[]>(this.apiUrl);
  }

  // Get charge by ID
  getChargeById(id: number): Observable<ChargeDto> {
    return this.http.get<ChargeDto>(`${this.apiUrl}/${id}`);
  }

  // Add new charge
  addCharge(request: AddChargeRequest): Observable<ChargeDto> {
    return this.http.post<ChargeDto>(this.apiUrl, request);
  }

  // Update existing charge
  updateCharge(id: number, request: UpdateChargeRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, request);
  }

  // Delete charge
  deleteCharge(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}