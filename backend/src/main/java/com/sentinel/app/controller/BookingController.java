package com.sentinel.app.controller;

import com.sentinel.app.dto.BookingRequest;
import com.sentinel.app.model.Booking;
import com.sentinel.app.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> book(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.book(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(booking);
    }
}
