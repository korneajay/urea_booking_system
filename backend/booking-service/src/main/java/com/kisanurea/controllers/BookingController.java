package com.kisanurea.controllers;

import com.kisanurea.models.Booking;
import com.kisanurea.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> book(@RequestParam String farmerId, @RequestParam String dealerId, @RequestParam double quantity) {
        return ResponseEntity.ok(bookingService.createBooking(farmerId, dealerId, quantity));
    }

    @GetMapping("/dealer/{dealerId}")
    public ResponseEntity<List<Booking>> getQueue(@PathVariable String dealerId) {
        return ResponseEntity.ok(bookingService.getDealerQueue(dealerId));
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Booking>> getFarmerBookings(@PathVariable String farmerId) {
        return ResponseEntity.ok(bookingService.getFarmerBookings(farmerId));
    }

    @GetMapping
    public ResponseEntity<List<Booking>> getAll() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateStatus(@PathVariable String bookingId, @RequestParam String status) {
        return ResponseEntity.ok(bookingService.updateStatus(bookingId, status));
    }

    @GetMapping("/dealer/{dealerId}/details")
    public ResponseEntity<List<java.util.Map<String, Object>>> getDealerQueueDetails(@PathVariable String dealerId) {
        return ResponseEntity.ok(bookingService.getDealerQueueDetails(dealerId));
    }

    @PostMapping("/collect")
    public ResponseEntity<Booking> collectBooking(@RequestParam String token, @RequestParam String dealerId) {
        return ResponseEntity.ok(bookingService.collectBooking(token, dealerId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<java.util.Map<String, String>> deleteBooking(@PathVariable String id) {
        try {
            bookingService.updateStatus(id, "PENDING"); // Revert stock if accepted
        } catch (Exception e) {}
        bookingService.deleteBooking(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Booking deleted successfully"));
    }
}

