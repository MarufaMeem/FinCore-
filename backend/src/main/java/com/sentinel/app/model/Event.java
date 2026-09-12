package com.sentinel.app.model;

import jakarta.persistence.*;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String venue;
    private String eventDate; // ISO date string, kept simple on purpose
    private Integer totalSeats;
    private Integer availableSeats;
    private Double price;

    public Event() {}

    public Event(String name, String venue, String eventDate, Integer totalSeats, Double price) {
        this.name = name;
        this.venue = venue;
        this.eventDate = eventDate;
        this.totalSeats = totalSeats;
        this.availableSeats = totalSeats;
        this.price = price;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public String getEventDate() { return eventDate; }
    public void setEventDate(String eventDate) { this.eventDate = eventDate; }
    public Integer getTotalSeats() { return totalSeats; }
    public void setTotalSeats(Integer totalSeats) { this.totalSeats = totalSeats; }
    public Integer getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(Integer availableSeats) { this.availableSeats = availableSeats; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
}
