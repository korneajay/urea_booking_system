package com.kisanurea.repositories;

import com.kisanurea.models.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, String> {
    List<Booking> findByFarmerId(String farmerId);
    List<Booking> findByDealerId(String dealerId);
    Optional<Booking> findByToken(String token);
    
    @Transactional
    void deleteByFarmerId(String farmerId);
    
    @Transactional
    void deleteByDealerId(String dealerId);
}

