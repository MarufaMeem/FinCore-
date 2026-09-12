import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface Event {
  id: number;
  name: string;
  venue: string;
  eventDate: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
}

export interface BookingRequest {
  eventId: number;
  customerName: string;
  customerEmail: string;
  seats: number;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  constructor(private http: HttpClient) {}

  listEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${environment.apiBaseUrl}/events`);
  }

  getEvent(id: number): Observable<Event> {
    return this.http.get<Event>(`${environment.apiBaseUrl}/events/${id}`);
  }

  book(request: BookingRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/bookings`, request);
  }
}
