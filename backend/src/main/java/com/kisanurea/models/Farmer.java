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
@Table(name = "farmers")
public class Farmer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String adhar; // Aadhaar Number
    private String name;
    private String email;
    
    @Column(unique = true, nullable = false)
    private String phone;
    
    private String password;
    private String passbookNumber;
    private double landSize; // in acres
    private String cropType;
    private String state;
    private String village;
    private String district;
    private double ureaQuota; // auto-calculated
    private LocalDateTime registrationDate;
    private String category; // MARGINAL, SMALL, MEDIUM, LARGE
    private String priority; // HIGH, NORMAL, LOW
    private boolean blocked;
}
