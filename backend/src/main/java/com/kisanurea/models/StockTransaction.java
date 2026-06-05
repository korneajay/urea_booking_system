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
@Table(name = "stock_transactions")
public class StockTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    private String dealerId;
    private String farmerId;
    private double quantity;
    private String type; // RECEIVED, SOLD
    private LocalDateTime date;
}
