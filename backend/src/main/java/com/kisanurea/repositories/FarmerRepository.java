package com.kisanurea.repositories;

import com.kisanurea.models.Farmer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FarmerRepository extends JpaRepository<Farmer, String> {
    Optional<Farmer> findByAdhar(String adhar);
    Optional<Farmer> findByEmail(String email);
    Optional<Farmer> findByPhone(String phone);
    Optional<Farmer> findByEmailOrPhone(String email, String phone);
}
