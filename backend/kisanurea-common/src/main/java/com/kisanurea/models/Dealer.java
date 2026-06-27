package com.kisanurea.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "dealers")
public class Dealer {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String shopId;
    private String password;
    private String name;
    
    @Column(unique = true, nullable = false)
    private String phone;
    
    private String licenseNumber;
    private String state;
    private String village;
    private String district;
    private String mandal;
    private double currentStock; // in bags
    private boolean blocked;
}
