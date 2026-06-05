package com.kisanurea.repositories;

import com.kisanurea.models.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, String> {
    Optional<Admin> findByPhone(String phone);
    Optional<Admin> findByEmail(String email);
}
