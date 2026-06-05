package com.kisanurea.controllers;

import com.kisanurea.models.Admin;
import com.kisanurea.models.Dealer;
import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.AdminRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import com.kisanurea.services.AuthService;
import com.kisanurea.services.DealerService;
import com.kisanurea.services.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private FarmerService farmerService;

    @Autowired
    private DealerService dealerService;

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
        
        // Return OTP in response for easier testing/development
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
        // Enforce phone uniqueness across roles
        checkUniquePhone(farmer.getPhone());
        return ResponseEntity.ok(farmerService.registerFarmer(farmer));
    }

    @PostMapping("/register/dealer")
    public ResponseEntity<Dealer> registerDealer(@RequestBody Dealer dealer) {
        dealer.setPhone(normalizePhone(dealer.getPhone()));
        // Enforce phone uniqueness across roles
        checkUniquePhone(dealer.getPhone());
        return ResponseEntity.ok(dealerService.registerDealer(dealer));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<Admin> registerAdmin(@RequestBody Admin admin) {
        admin.setPhone(normalizePhone(admin.getPhone()));
        // Enforce phone uniqueness across roles
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
}
