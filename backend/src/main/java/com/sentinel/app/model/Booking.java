package com.sentinel.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long eventId;
    private String customerName;
    private String customerEmail;
    private Integer seats;
    private String status; // CONFIRMED, CANCELLED

    public Booking() {}

    public Booking(Long eventId, String customerName, String customerEmail, Integer seats, String status) {
        this.eventId = eventId;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.seats = seats;
        this.status = status;
    }

    public Long getId() { return id; }
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public Integer getSeats() { return seats; }
    public void setSeats(Integer seats) { this.seats = seats; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
