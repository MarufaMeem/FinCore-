package com.sentinel.app.service;

import com.sentinel.app.dto.BookingRequest;
import com.sentinel.app.model.Booking;
import com.sentinel.app.model.Event;
import com.sentinel.app.repository.BookingRepository;
import com.sentinel.app.repository.EventRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private EventRepository eventRepository;

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    private Event event;

   @BeforeEach
void setUp() {
    event = new Event("Test Event", "Test Venue", "2026-12-01", 100, 500.0);
    event.setAvailableSeats(100);
    lenient().when(eventRepository.findById(1L)).thenReturn(Optional.of(event));
    lenient().when(eventRepository.save(any(Event.class))).thenAnswer(inv -> inv.getArgument(0));
    lenient().when(bookingRepository.save(any(Booking.class))).thenAnswer(inv -> inv.getArgument(0));
}

    @Test
    void rejectsBookingWhenNotEnoughSeats() {
        BookingRequest request = request(1L, "A", "a@test.com", 150);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> bookingService.book(request));
        assertTrue(ex.getMessage().contains("seats left"));
    }

    @Test
    void confirmsBookingWhenSeatsAvailable() {
        BookingRequest request = request(1L, "A", "a@test.com", 10);

        Booking booking = bookingService.book(request);

        assertEquals("CONFIRMED", booking.getStatus());
        assertEquals(10, booking.getSeats());
    }

    // This test documents the correct expected behavior and will FAIL against the
    // current (seeded-bug) implementation, which adds seats back instead of subtracting
    // them. That failure is intentional — it's what the Cypress + JIRA pipeline reports.
    @Test
    void reducesAvailableSeatsAfterBooking() {
        BookingRequest request = request(1L, "A", "a@test.com", 10);

        bookingService.book(request);

        assertEquals(90, event.getAvailableSeats(),
                "Available seats should decrease by the number booked");
    }

    private BookingRequest request(Long eventId, String name, String email, int seats) {
        BookingRequest r = new BookingRequest();
        r.setEventId(eventId);
        r.setCustomerName(name);
        r.setCustomerEmail(email);
        r.setSeats(seats);
        return r;
    }
}
