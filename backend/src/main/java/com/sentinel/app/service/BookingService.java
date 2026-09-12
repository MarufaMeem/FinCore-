package com.sentinel.app.service;

import com.sentinel.app.dto.BookingRequest;
import com.sentinel.app.model.Booking;
import com.sentinel.app.model.Event;
import com.sentinel.app.repository.BookingRepository;
import com.sentinel.app.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class BookingService {
    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;

    public BookingService(EventRepository eventRepository, BookingRepository bookingRepository) {
        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
    }

    public Booking book(BookingRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new NoSuchElementException("Event not found: " + request.getEventId()));

        if (request.getSeats() > event.getAvailableSeats()) {
            throw new IllegalArgumentException("Only " + event.getAvailableSeats() + " seats left for " + event.getName());
        }

        event.setAvailableSeats(event.getAvailableSeats() - request.getSeats());
        eventRepository.save(event);

        Booking booking = new Booking(request.getEventId(), request.getCustomerName(),
                request.getCustomerEmail(), request.getSeats(), "CONFIRMED");
        return bookingRepository.save(booking);
    }
}