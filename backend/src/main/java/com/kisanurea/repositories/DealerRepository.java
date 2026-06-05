package com.kisanurea.repositories;

import com.kisanurea.models.Dealer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DealerRepository extends JpaRepository<Dealer, String> {
    Optional<Dealer> findByShopId(String shopId);
    Optional<Dealer> findByPhone(String phone);
    List<Dealer> findByStateAndDistrict(String state, String district);
    List<Dealer> findByState(String state);
}

