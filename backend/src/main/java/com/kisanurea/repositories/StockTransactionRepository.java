package com.kisanurea.repositories;

import com.kisanurea.models.StockTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface StockTransactionRepository extends JpaRepository<StockTransaction, String> {
    List<StockTransaction> findByDealerId(String dealerId);
    List<StockTransaction> findByFarmerId(String farmerId);
    
    @Transactional
    void deleteByFarmerId(String farmerId);
    
    @Transactional
    void deleteByDealerId(String dealerId);
}
