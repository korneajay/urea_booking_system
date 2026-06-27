package com.kisanurea.controllers;

import com.kisanurea.models.Admin;
import com.kisanurea.models.Dealer;
import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.AdminRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import com.kisanurea.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private DealerRepository dealerRepository;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(@RequestBody Map<String, String> request) {
        String phone = java.util.Objects.requireNonNull(request.get("phone"));
        String role = java.util.Objects.requireNonNull(request.get("role"));
        
        String otp = authService.sendOtp(phone, role);
        
        return ResponseEntity.ok(Map.of(
            "message", "OTP sent successfully",
            "otp", otp
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthService.LoginResponse> verifyOtp(@RequestBody Map<String, String> request) {
        String phone = java.util.Objects.requireNonNull(request.get("phone"));
        String otp = java.util.Objects.requireNonNull(request.get("otp"));
        
        AuthService.LoginResponse response = authService.verifyOtp(phone, otp);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login-direct")
    public ResponseEntity<AuthService.LoginResponse> loginDirect(@RequestBody Map<String, String> request) {
        String phone = java.util.Objects.requireNonNull(request.get("phone"));
        String role = java.util.Objects.requireNonNull(request.get("role"));
        
        AuthService.LoginResponse response = authService.loginDirect(phone, role);
        return ResponseEntity.ok(response);
    }

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.length() == 10) {
            return "91" + clean;
        }
        return clean;
    }

    @PostMapping("/register/farmer")
    public ResponseEntity<Farmer> registerFarmer(@RequestBody Farmer farmer) {
        farmer.setPhone(normalizePhone(farmer.getPhone()));
        checkUniquePhone(farmer.getPhone());
        if (farmer.getEmail() == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (farmerRepository.findByEmail(farmer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Auto-calculate urea quota
        double quota = calculateQuota(farmer.getLandSize(), farmer.getCropType());
        farmer.setUreaQuota(quota);

        // Assign category and priority
        assignCategoryAndPriority(farmer);

        farmer.setRegistrationDate(LocalDateTime.now());
        farmer.setBlocked(false);
        return ResponseEntity.ok(farmerRepository.save(farmer));
    }

    @PostMapping("/register/dealer")
    public ResponseEntity<Dealer> registerDealer(@RequestBody Dealer dealer) {
        dealer.setPhone(normalizePhone(dealer.getPhone()));
        checkUniquePhone(dealer.getPhone());
        if (dealer.getShopId() != null && dealerRepository.findByShopId(dealer.getShopId()).isPresent()) {
            throw new RuntimeException("Shop ID already exists");
        }
        dealer.setBlocked(false);
        return ResponseEntity.ok(dealerRepository.save(dealer));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        admin.setPhone(normalizePhone(admin.getPhone()));
        checkUniquePhone(admin.getPhone());
        if (adminRepository.findByEmail(admin.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        return ResponseEntity.ok(adminRepository.save(admin));
    }

    private void checkUniquePhone(String phone) {
        String normalized = normalizePhone(phone);
        if (farmerRepository.findByPhone(normalized).isPresent() ||
            dealerRepository.findByPhone(normalized).isPresent() ||
            adminRepository.findByPhone(normalized).isPresent()) {
            throw new RuntimeException("Phone number already registered in the system");
        }
    }

    private double calculateQuota(double landSize, String cropType) {
        double rate = 1.0;
        if (cropType != null) {
            switch (cropType.toLowerCase()) {
                case "paddy":
                case "rice":
                    rate = 2.0;
                    break;
                case "cotton":
                    rate = 1.5;
                    break;
                case "maize":
                    rate = 1.2;
                    break;
            }
        }
        return Math.ceil(landSize * rate);
    }

    private void assignCategoryAndPriority(Farmer farmer) {
        double size = farmer.getLandSize();
        if (size < 2.0) {
            farmer.setCategory("MARGINAL");
            farmer.setPriority("HIGH");
        } else if (size >= 2.0 && size < 5.0) {
            farmer.setCategory("SMALL");
            farmer.setPriority("HIGH");
        } else if (size >= 5.0 && size < 10.0) {
            farmer.setCategory("MEDIUM");
            farmer.setPriority("NORMAL");
        } else {
            farmer.setCategory("LARGE");
            farmer.setPriority("LOW");
        }
    }
}
