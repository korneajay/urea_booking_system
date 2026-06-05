package com.kisanurea.services;

import com.kisanurea.models.Booking;
import com.kisanurea.models.Dealer;
import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.BookingRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private DealerRepository dealerRepository;

    public Booking createBooking(String farmerId, String dealerId, double quantity) {
        if (farmerId == null || dealerId == null) {
            throw new IllegalArgumentException("Farmer ID and Dealer ID cannot be null");
        }
        Farmer farmer = farmerRepository.findById(farmerId).orElseThrow(() -> new RuntimeException("Farmer not found"));
        if (farmer.isBlocked()) {
            throw new RuntimeException("Farmer account is blocked");
        }
        Dealer dealer = dealerRepository.findById(dealerId).orElseThrow(() -> new RuntimeException("Dealer not found"));
        if (dealer.isBlocked()) {
            throw new RuntimeException("Dealer account is blocked");
        }

        double maxEligible = farmer.getLandSize() * 2.0;
        List<Booking> activeBookings = bookingRepository.findByFarmerId(farmerId);
        double alreadyBooked = activeBookings.stream()
                .filter(b -> !"REJECTED".equals(b.getStatus()))
                .mapToDouble(Booking::getQuantity)
                .sum();
        double remainingQuota = Math.max(0.0, maxEligible - alreadyBooked);

        if (quantity > remainingQuota) {
             throw new RuntimeException("Max bags exceeded! You have already booked " + alreadyBooked + " / " + maxEligible + " bags. Remaining quota: " + remainingQuota + " bags.");
        }

        if (quantity <= 0) {
             throw new RuntimeException("Requested bags must be greater than zero");
        }

        Booking booking = new Booking();
        booking.setFarmerId(farmerId);
        booking.setDealerId(dealerId);
        booking.setQuantity(quantity);
        booking.setToken(UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        booking.setStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now());
        booking.setCollectionDate(LocalDateTime.now().plusDays(3)); // Default 3 days later

        // Calculate priority score
        double priorityScore = calculatePriorityScore(farmer);
        booking.setPriorityScore(priorityScore);

        return bookingRepository.save(booking);
    }

    private double calculatePriorityScore(Farmer farmer) {
        double score = 0;
        switch (farmer.getCategory()) {
            case "MARGINAL": score = 1000; break;
            case "SMALL": score = 500; break;
            case "MEDIUM": score = 200; break;
            case "LARGE": score = 100; break;
        }
        // Subtract land size to prioritize smaller farmers within the same category
        score -= (farmer.getLandSize() * 0.1);
        
        // Subtract registration date factor (earlier is higher)
        // For simplicity, we'll just use the category and land size for now
        return score;
    }

    public List<Booking> getDealerQueue(String dealerId) {
        return bookingRepository.findByDealerId(dealerId).stream()
                .sorted(Comparator.comparing(Booking::getPriorityScore).reversed())
                .collect(Collectors.toList());
    }

    public List<Booking> getFarmerBookings(String farmerId) {
        return bookingRepository.findByFarmerId(farmerId).stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .collect(Collectors.toList());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted(Comparator.comparing(Booking::getBookingDate).reversed())
                .collect(Collectors.toList());
    }

    public Booking updateStatus(String bookingId, String status) {
        if (bookingId == null) {
            throw new IllegalArgumentException("Booking ID cannot be null");
        }
        String safeBookingId = Objects.requireNonNull(bookingId, "Booking ID cannot be null");
        Booking booking = bookingRepository.findById(safeBookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        String normalizedStatus = status == null ? "" : status.trim().toUpperCase();
        if (!List.of("PENDING", "ACCEPTED", "REJECTED", "OUT_OF_STOCK").contains(normalizedStatus)) {
            throw new RuntimeException("Invalid booking status");
        }

        String dealerId = booking.getDealerId();
        if (dealerId == null) {
            throw new RuntimeException("Dealer ID not found for this booking");
        }
        String safeDealerId = Objects.requireNonNull(dealerId, "Dealer ID not found for this booking");
        Dealer dealer = dealerRepository.findById(safeDealerId)
                .orElseThrow(() -> new RuntimeException("Dealer not found"));

        if ("ACCEPTED".equals(normalizedStatus) && !"ACCEPTED".equals(booking.getStatus())) {
            if (dealer.getCurrentStock() < booking.getQuantity()) {
                booking.setStatus("OUT_OF_STOCK");
                return bookingRepository.save(booking);
            }
            dealer.setCurrentStock(dealer.getCurrentStock() - booking.getQuantity());
            dealerRepository.save(dealer);
            booking.setCollectionDate(LocalDateTime.now().plusDays(3));
        }

        if ("ACCEPTED".equals(booking.getStatus()) && !"ACCEPTED".equals(normalizedStatus)) {
            dealer.setCurrentStock(dealer.getCurrentStock() + booking.getQuantity());
            dealerRepository.save(dealer);
        }

        booking.setStatus(normalizedStatus);
        return bookingRepository.save(booking);
    }

    public List<java.util.Map<String, Object>> getDealerQueueDetails(String dealerId) {
        List<Booking> queue = getDealerQueue(dealerId);
        return queue.stream().map(booking -> {
            java.util.Map<String, Object> map = new java.util.HashMap<>();
            map.put("id", booking.getId());
            map.put("farmerId", booking.getFarmerId());
            map.put("dealerId", booking.getDealerId());
            map.put("quantity", booking.getQuantity());
            map.put("token", booking.getToken());
            map.put("status", booking.getStatus());
            map.put("bookingDate", booking.getBookingDate());
            map.put("collectionDate", booking.getCollectionDate());
            
            String farmerId = booking.getFarmerId();
            if (farmerId != null) {
                Farmer farmer = farmerRepository.findById(farmerId).orElse(null);
                if (farmer != null) {
                    map.put("farmerName", farmer.getName());
                    map.put("farmerPhone", farmer.getPhone());
                    map.put("landSize", farmer.getLandSize());
                    map.put("eligibleBags", farmer.getLandSize() * 2.0);
                    map.put("state", farmer.getState());
                    map.put("district", farmer.getDistrict());
                    map.put("village", farmer.getVillage());
                }
            }
            return map;
        }).collect(Collectors.toList());
    }

    public Booking collectBooking(String token, String dealerId) {
        Booking booking = bookingRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token. Booking not found."));
        if (!booking.getDealerId().equals(dealerId)) {
            throw new RuntimeException("This booking belongs to a different dealer.");
        }
        if (!"ACCEPTED".equals(booking.getStatus())) {
            throw new RuntimeException("Booking must be accepted by the dealer before collection.");
        }
        booking.setStatus("COLLECTED");
        booking.setCollectionDate(LocalDateTime.now());
        
        // Also update dealer's stock (handled when booking is accepted, but here we finalize the collection)
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        if (id == null) {
            throw new IllegalArgumentException("Booking ID cannot be null");
        }
        bookingRepository.deleteById(id);
    }
}
