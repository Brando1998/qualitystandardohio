import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private client = "http://localhost:8000/api/client";

  constructor(private http: HttpClient) { }

  placeOrder(data: any): Observable<any> {
    return this.http.post(`${this.client}/service-orders/`, data);
  }

  getOrders(): Observable<any> {
    return this.http.get(`${this.client}/service-orders/`);
  }
}
