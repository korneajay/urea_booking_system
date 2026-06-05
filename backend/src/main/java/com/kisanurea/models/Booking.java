package com.kisanurea.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String farmerId;
    private String dealerId;
    private double quantity;
    private String token;
    private String status; // PENDING, APPROVED, COLLECTED, CANCELLED
    private LocalDateTime bookingDate;
    private LocalDateTime collectionDate;
    private double priorityScore; // Calculated based on farmer category and land size
}
