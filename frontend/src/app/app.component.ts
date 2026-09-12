import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event, EventService } from './event.service';
import { BookingFormComponent } from './booking-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, BookingFormComponent],
  template: `
    <div class="container">
      <h1>Sentinel</h1>
      <p class="subtitle">Book your seat for upcoming, highly anticipated events.</p>

      <div class="grid">
        <div class="card" *ngFor="let event of events" data-cy="event-card">
          <h3>{{ event.name }}</h3>
          <p>📍 {{ event.venue }}<br>📅 {{ event.eventDate }}</p>
          
          <div class="card-footer">
            <span class="badge">{{ event.availableSeats }} / {{ event.totalSeats }} seats</span>
            <button data-cy="select-event" (click)="select(event)">Book now</button>
          </div>
        </div>
      </div>

      <app-booking-form
        *ngIf="selectedEvent"
        [event]="selectedEvent"
        (booked)="onBooked()">
      </app-booking-form>
    </div>
  `
})
export class AppComponent implements OnInit {
  events: Event[] = [];
  selectedEvent: Event | null = null;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.listEvents().subscribe(events => this.events = events);
  }

  select(event: Event) {
    this.selectedEvent = event;
  }

  onBooked() {
    this.loadEvents();
  }
}
