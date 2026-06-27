package com.kisanurea.services;

import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.BookingRepository;
import com.kisanurea.repositories.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FarmerService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.length() == 10) {
            return "91" + clean;
        }
        return clean;
    }

    public Farmer registerFarmer(@NonNull Farmer farmer) {
        if (farmer.getEmail() == null) {
            throw new IllegalArgumentException("Email cannot be null");
        }
        if (farmerRepository.findByEmail(farmer.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        farmer.setPhone(normalizePhone(farmer.getPhone()));
        if (farmerRepository.findByPhone(farmer.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }

        // Auto-calculate urea quota
        double quota = calculateQuota(farmer.getLandSize(), farmer.getCropType());
        farmer.setUreaQuota(quota);

        // Assign category and priority
        assignCategoryAndPriority(farmer);

        farmer.setRegistrationDate(LocalDateTime.now());
        farmer.setBlocked(false);
        return farmerRepository.save(farmer);
    }

    public Farmer login(@NonNull String identifier, @NonNull String password) {
        Farmer farmer = farmerRepository.findByEmailOrPhone(identifier, identifier)
                .orElseThrow(() -> new RuntimeException("Invalid email/phone or password"));
        if (farmer.isBlocked()) {
            throw new RuntimeException("Farmer account is blocked");
        }
        if (!farmer.getPassword().equals(password)) {
            throw new RuntimeException("Invalid email/phone or password");
        }
        return farmer;
    }

    public void resetPassword(@NonNull String email, @NonNull String newPassword) {
        Farmer farmer = farmerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found with this email"));
        farmer.setPassword(newPassword);
        farmerRepository.save(farmer);
    }

    private double calculateQuota(double landSize, String cropType) {
        double rate = 1.0; // Default
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

    public List<Farmer> getAllFarmersSorted() {
        // We'll implement sorting logic in the controller or a custom query
        return farmerRepository.findAll();
    }

    public Farmer blockFarmer(@NonNull String farmerId, boolean blocked) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        farmer.setBlocked(blocked);
        java.util.Objects.requireNonNull(farmer);
        return farmerRepository.save(farmer);
    }

    public void deleteFarmerCompletely(@NonNull String farmerId) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        bookingRepository.deleteByFarmerId(farmerId);
        java.util.Objects.requireNonNull(farmer);
        farmerRepository.delete(farmer);
    }

    public Farmer updateFarmerDetails(@NonNull String farmerId, @NonNull Farmer details) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        farmer.setName(details.getName());
        farmer.setEmail(details.getEmail());
        farmer.setPhone(normalizePhone(details.getPhone()));
        farmer.setAdhar(details.getAdhar());
        farmer.setPassbookNumber(details.getPassbookNumber());
        farmer.setLandSize(details.getLandSize());
        farmer.setCropType(details.getCropType());
        farmer.setState(details.getState());
        farmer.setDistrict(details.getDistrict());
        farmer.setVillage(details.getVillage());
        
        farmer.setUreaQuota(calculateQuota(details.getLandSize(), details.getCropType()));
        assignCategoryAndPriority(farmer);
        
        return farmerRepository.save(farmer);
    }
}

