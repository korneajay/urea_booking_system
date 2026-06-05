package com.kisanurea.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    
    @Column(unique = true, nullable = false)
    private String phone;
    
    private String email;
    private String password;
}
