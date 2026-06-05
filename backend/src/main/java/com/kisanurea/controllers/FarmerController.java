package com.kisanurea.controllers;

import com.kisanurea.models.Farmer;
import com.kisanurea.services.FarmerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class FarmerController {

    @Autowired
    private FarmerService farmerService;

    @PostMapping("/register")
    public ResponseEntity<Farmer> register(@RequestBody Farmer farmer) {
        java.util.Objects.requireNonNull(farmer);
        return ResponseEntity.ok(farmerService.registerFarmer(farmer));
    }

    @PostMapping("/login")
    public ResponseEntity<Farmer> login(@RequestBody LoginRequest loginRequest) {
        String identifier = java.util.Objects.requireNonNull(loginRequest.getIdentifier());
        String password = java.util.Objects.requireNonNull(loginRequest.getPassword());
        return ResponseEntity.ok(farmerService.login(identifier, password));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        String email = java.util.Objects.requireNonNull(request.getEmail());
        String newPassword = java.util.Objects.requireNonNull(request.getNewPassword());
        farmerService.resetPassword(email, newPassword);
        return ResponseEntity.ok("Password reset successfully");
    }

    @GetMapping
    public ResponseEntity<List<Farmer>> getAll() {
        return ResponseEntity.ok(farmerService.getAllFarmersSorted());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Farmer> updateFarmer(@PathVariable String id, @RequestBody Farmer details) {
        java.util.Objects.requireNonNull(id);
        java.util.Objects.requireNonNull(details);
        return ResponseEntity.ok(farmerService.updateFarmerDetails(id, details));
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<Farmer> blockFarmer(@PathVariable String id, @RequestParam boolean blocked) {
        java.util.Objects.requireNonNull(id);
        return ResponseEntity.ok(farmerService.blockFarmer(id, blocked));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteFarmer(@PathVariable String id) {
        java.util.Objects.requireNonNull(id);
        farmerService.deleteFarmerCompletely(id);
        return ResponseEntity.ok(Map.of("message", "Farmer deleted permanently"));
    }


    // Inner classes for request bodies
    public static class LoginRequest {
        private String identifier;
        private String password;
        public String getIdentifier() { return identifier; }
        public void setIdentifier(String identifier) { this.identifier = identifier; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class ForgotPasswordRequest {
        private String email;
        private String newPassword;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
