package com.kisanurea.services;

import com.kisanurea.models.Booking;
import com.kisanurea.models.Dealer;
import com.kisanurea.repositories.BookingRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private DealerRepository dealerRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Map<String, Object> getCrisisReport() {
        Map<String, Object> report = new HashMap<>();

        // 1. Unserved farmer count (total farmers - total collected bookings)
        long totalFarmers = farmerRepository.count();
        long servedFarmers = bookingRepository.findAll().stream()
                .filter(b -> b.getStatus().equals("COLLECTED"))
                .map(Booking::getFarmerId)
                .distinct()
                .count();
        report.put("unservedFarmers", totalFarmers - servedFarmers);

        // 2. Dealer-wise stock vs sales
        List<Dealer> dealers = dealerRepository.findAll();
        report.put("dealerStats", dealers.stream().map(d -> {
            Map<String, Object> stats = new HashMap<>();
            stats.put("name", d.getName());
            stats.put("stock", d.getCurrentStock());
            stats.put("village", d.getVillage());
            return stats;
        }).toList());

        // 3. Predicted Shortage Zones
        // Logic: Districts where total pending booking quantity > total dealer stock
        Map<String, Double> districtStock = new HashMap<>();
        dealers.forEach(d -> {
            if (d.getDistrict() != null) {
                districtStock.merge(d.getDistrict(), d.getCurrentStock(), (a, b) -> a + b);
            }
        });
        
        report.put("shortageZones", "Data collection in progress...");

        return report;
    }
}
