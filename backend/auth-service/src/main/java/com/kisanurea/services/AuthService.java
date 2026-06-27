package com.kisanurea.services;

import com.kisanurea.models.Admin;
import com.kisanurea.models.Dealer;
import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.AdminRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import com.kisanurea.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private DealerRepository dealerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Stores phone -> temporary OTP
    private final Map<String, String> otpStorage = new ConcurrentHashMap<>();
    private final Random random = new Random();

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.length() == 10) {
            return "91" + clean;
        }
        return clean;
    }

    public String sendOtp(String phone, String role) {
        String normalizedPhone = normalizePhone(phone);
        // Enforce role existence check
        boolean exists = false;
        if ("FARMER".equalsIgnoreCase(role)) {
            exists = farmerRepository.findByPhone(normalizedPhone).isPresent();
        } else if ("DEALER".equalsIgnoreCase(role)) {
            exists = dealerRepository.findByPhone(normalizedPhone).isPresent();
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            exists = adminRepository.findByPhone(normalizedPhone).isPresent();
        }

        if (!exists) {
            throw new RuntimeException("Phone number not registered as a " + role);
        }

        // Generate a 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        otpStorage.put(normalizedPhone, otp);

        // Print to console for logging/verification
        System.out.println("==================================================");
        System.out.println("TEMPORARY OTP FOR " + normalizedPhone + " (" + role + "): " + otp);
        System.out.println("==================================================");

        return otp;
    }

    public LoginResponse verifyOtp(String phone, String otp) {
        String normalizedPhone = normalizePhone(phone);
        String storedOtp = otpStorage.get(normalizedPhone);
        
        // Allow master bypass OTP "123456" as a temporary fallback
        boolean isValidOtp = (storedOtp != null && storedOtp.equals(otp)) || "123456".equals(otp);
        
        if (!isValidOtp) {
            throw new RuntimeException("Invalid OTP code");
        }

        // OTP verified successfully, clear it if it was a stored one
        if (storedOtp != null && storedOtp.equals(otp)) {
            otpStorage.remove(normalizedPhone);
        }

        // Find the user and determine their role
        Optional<Farmer> farmerOpt = farmerRepository.findByPhone(normalizedPhone);
        if (farmerOpt.isPresent()) {
            Farmer farmer = farmerOpt.get();
            if (farmer.isBlocked()) {
                throw new RuntimeException("Farmer account is blocked");
            }
            String token = jwtUtils.generateToken(farmer.getId(), normalizedPhone, "FARMER", farmer.getName());
            return new LoginResponse(farmer.getId(), "FARMER", farmer.getName(), normalizedPhone, farmer, token);
        }

        Optional<Dealer> dealerOpt = dealerRepository.findByPhone(normalizedPhone);
        if (dealerOpt.isPresent()) {
            Dealer dealer = dealerOpt.get();
            if (dealer.isBlocked()) {
                throw new RuntimeException("Dealer account is blocked");
            }
            String token = jwtUtils.generateToken(dealer.getId(), normalizedPhone, "DEALER", dealer.getName());
            return new LoginResponse(dealer.getId(), "DEALER", dealer.getName(), normalizedPhone, dealer, token);
        }

        Optional<Admin> adminOpt = adminRepository.findByPhone(normalizedPhone);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            String token = jwtUtils.generateToken(admin.getId(), normalizedPhone, "ADMIN", admin.getName());
            return new LoginResponse(admin.getId(), "ADMIN", admin.getName(), normalizedPhone, admin, token);
        }

        throw new RuntimeException("User account not found for this phone number");
    }

    public LoginResponse loginDirect(String phone, String role) {
        String normalizedPhone = normalizePhone(phone);
        if ("FARMER".equalsIgnoreCase(role)) {
            Optional<Farmer> farmerOpt = farmerRepository.findByPhone(normalizedPhone);
            if (farmerOpt.isPresent()) {
                Farmer farmer = farmerOpt.get();
                if (farmer.isBlocked()) {
                    throw new RuntimeException("Farmer account is blocked");
                }
                String token = jwtUtils.generateToken(farmer.getId(), normalizedPhone, "FARMER", farmer.getName());
                return new LoginResponse(farmer.getId(), "FARMER", farmer.getName(), normalizedPhone, farmer, token);
            }
        } else if ("DEALER".equalsIgnoreCase(role)) {
            Optional<Dealer> dealerOpt = dealerRepository.findByPhone(normalizedPhone);
            if (dealerOpt.isPresent()) {
                Dealer dealer = dealerOpt.get();
                if (dealer.isBlocked()) {
                    throw new RuntimeException("Dealer account is blocked");
                }
                String token = jwtUtils.generateToken(dealer.getId(), normalizedPhone, "DEALER", dealer.getName());
                return new LoginResponse(dealer.getId(), "DEALER", dealer.getName(), normalizedPhone, dealer, token);
            }
        } else if ("ADMIN".equalsIgnoreCase(role)) {
            Optional<Admin> adminOpt = adminRepository.findByPhone(normalizedPhone);
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                String token = jwtUtils.generateToken(admin.getId(), normalizedPhone, "ADMIN", admin.getName());
                return new LoginResponse(admin.getId(), "ADMIN", admin.getName(), normalizedPhone, admin, token);
            }
        }
        throw new RuntimeException("Phone number not registered as " + role);
    }

    public static class LoginResponse {
        private String id;
        private String role;
        private String name;
        private String phone;
        private Object userDetails;
        private String token;

        public LoginResponse(String id, String role, String name, String phone, Object userDetails, String token) {
            this.id = id;
            this.role = role;
            this.name = name;
            this.phone = phone;
            this.userDetails = userDetails;
            this.token = token;
        }

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public Object getUserDetails() { return userDetails; }
        public void setUserDetails(Object userDetails) { this.userDetails = userDetails; }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
    }
}
