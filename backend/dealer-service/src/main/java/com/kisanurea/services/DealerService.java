package com.kisanurea.services;

import com.kisanurea.models.Dealer;
import com.kisanurea.repositories.BookingRepository;
import com.kisanurea.repositories.DealerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DealerService {

    @Autowired
    private DealerRepository dealerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Dealer updateStock(@NonNull String dealerId, double quantity, @NonNull String type, String farmerId) {
        Dealer dealer = dealerRepository.findById(dealerId).orElseThrow(() -> new RuntimeException("Dealer not found"));

        if (type.equals("SOLD")) {
            if (dealer.getCurrentStock() < quantity) {
                throw new RuntimeException("Insufficient stock");
            }
            dealer.setCurrentStock(dealer.getCurrentStock() - quantity);
        } else if (type.equals("RECEIVED")) {
            dealer.setCurrentStock(dealer.getCurrentStock() + quantity);
        }

        java.util.Objects.requireNonNull(dealer);
        return dealerRepository.save(dealer);
    }

    public List<Dealer> getAllDealers() {
        return dealerRepository.findAll();
    }
    
    private String normalizePhone(String phone) {
        if (phone == null) return null;
        String clean = phone.replaceAll("[^0-9]", "");
        if (clean.length() == 10) {
            return "91" + clean;
        }
        return clean;
    }

    public Dealer registerDealer(@NonNull Dealer dealer) {
        if (dealer.getPhone() == null) {
            throw new IllegalArgumentException("Phone number cannot be null");
        }
        dealer.setPhone(normalizePhone(dealer.getPhone()));
        if (dealerRepository.findByPhone(dealer.getPhone()).isPresent()) {
            throw new RuntimeException("Phone number already registered");
        }
        if (dealer.getShopId() != null && dealerRepository.findByShopId(dealer.getShopId()).isPresent()) {
            throw new RuntimeException("Shop ID already exists");
        }
        dealer.setBlocked(false);
        return dealerRepository.save(dealer);
    }

    public Dealer login(@NonNull String shopId, @NonNull String password) {
        Dealer dealer = dealerRepository.findByShopId(shopId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        if (dealer.isBlocked()) {
            throw new RuntimeException("Dealer account is blocked");
        }
        if (!dealer.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return dealer;
    }

    public Dealer blockDealer(@NonNull String dealerId, boolean blocked) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        dealer.setBlocked(blocked);
        java.util.Objects.requireNonNull(dealer);
        return dealerRepository.save(dealer);
    }

    public List<Dealer> getNearbyDealers(String state, String district) {
        List<Dealer> list = dealerRepository.findByStateAndDistrict(state, district);
        if (list.isEmpty()) {
            list = dealerRepository.findByState(state);
        }
        if (list.isEmpty()) {
            list = dealerRepository.findAll();
        }
        return list;
    }

    public void deleteDealerCompletely(@NonNull String dealerId) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        bookingRepository.deleteByDealerId(dealerId);
        java.util.Objects.requireNonNull(dealer);
        dealerRepository.delete(dealer);
    }

    public Dealer updateDealerDetails(@NonNull String dealerId, @NonNull Dealer details) {
        Dealer dealer = dealerRepository.findById(dealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));
        dealer.setName(details.getName());
        dealer.setPhone(normalizePhone(details.getPhone()));
        dealer.setShopId(details.getShopId());
        dealer.setLicenseNumber(details.getLicenseNumber());
        dealer.setState(details.getState());
        dealer.setDistrict(details.getDistrict());
        dealer.setVillage(details.getVillage());
        dealer.setMandal(details.getMandal());
        dealer.setCurrentStock(details.getCurrentStock());
        return dealerRepository.save(dealer);
    }
}


