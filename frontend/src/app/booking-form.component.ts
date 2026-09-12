import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Event, EventService } from './event.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h3>Book: {{ event.name }}</h3>
      <p>{{ event.availableSeats }} seats left &middot; ৳{{ event.price }} each</p>

      <label>Name</label>
      <input data-cy="customer-name" [(ngModel)]="name" placeholder="Full name">

      <label>Email</label>
      <input data-cy="customer-email" [(ngModel)]="email" placeholder="you@example.com">

      <label>Seats</label>
      <input data-cy="seat-count" type="number" [(ngModel)]="seats" min="1">

      <button data-cy="submit-booking" (click)="submit()" [disabled]="submitting">
        {{ submitting ? 'Booking...' : 'Confirm booking' }}
      </button>

      <p class="error" *ngIf="errorMessage" data-cy="booking-error">{{ errorMessage }}</p>
      <p class="success" *ngIf="successMessage" data-cy="booking-success">{{ successMessage }}</p>
    </div>
  `
})
export class BookingFormComponent {
  @Input() event!: Event;
  @Output() booked = new EventEmitter<void>();

  name = '';
  email = '';
  seats = 1;
  submitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(private eventService: EventService) {}

  submit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name || !this.email || !this.seats || this.seats < 1) {
      this.errorMessage = 'Please fill in all fields with a valid seat count.';
      return;
    }

    this.submitting = true;
    this.eventService.book({
      eventId: this.event.id,
      customerName: this.name,
      customerEmail: this.email,
      seats: Number(this.seats)
    }).subscribe({
      next: () => {
        this.submitting = false;
        this.successMessage = 'Booking confirmed!';
        this.booked.emit();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err?.error?.error || 'Booking failed. Please try again.';
      }
    });
  }
}
