package com.kisanurea.config;

import com.kisanurea.models.Admin;
import com.kisanurea.models.Dealer;
import com.kisanurea.models.Farmer;
import com.kisanurea.repositories.AdminRepository;
import com.kisanurea.repositories.DealerRepository;
import com.kisanurea.repositories.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    @Autowired
    private FarmerRepository farmerRepository;

    @Autowired
    private DealerRepository dealerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default Admin if not exists
        if (adminRepository.findByPhone("918187872374").isEmpty()) {
            adminRepository.findByPhone("9999999999").ifPresent(adminRepository::delete);
            Admin admin = new Admin();
            admin.setName("System Admin");
            admin.setPhone("918187872374");
            admin.setEmail("admin@kisanurea.com");
            admin.setPassword("admin123");
            adminRepository.save(admin);
            System.out.println("Seeded default Admin: Phone 918187872374");
        }

        // Seed default Dealer if not exists
        if (dealerRepository.findByPhone("918888888888").isEmpty()) {
            dealerRepository.findByPhone("8888888888").ifPresent(dealerRepository::delete);
            Dealer dealer = new Dealer();
            dealer.setName("Suresh Kumar");
            dealer.setPhone("918888888888");
            dealer.setShopId("SH001");
            dealer.setLicenseNumber("LIC-8888");
            dealer.setPassword("dealer123");
            dealer.setState("Telangana");
            dealer.setDistrict("Nalgonda");
            dealer.setVillage("Choutuppal");
            dealer.setMandal("Choutuppal");
            dealer.setCurrentStock(200.0);
            dealer.setBlocked(false);
            dealerRepository.save(dealer);
            System.out.println("Seeded default Dealer: Phone 918888888888");
        }

        // Seed default Farmer if not exists
        if (farmerRepository.findByPhone("917777777777").isEmpty()) {
            farmerRepository.findByPhone("7777777777").ifPresent(farmerRepository::delete);
            Farmer farmer = new Farmer();
            farmer.setName("Ramesh Patel");
            farmer.setPhone("917777777777");
            farmer.setAdhar("123456789012");
            farmer.setPassbookNumber("PB-7777");
            farmer.setPassword("farmer123");
            farmer.setLandSize(4.5);
            farmer.setCropType("Paddy");
            farmer.setUreaQuota(9.0);
            farmer.setCategory("SMALL");
            farmer.setPriority("HIGH");
            farmer.setState("Telangana");
            farmer.setDistrict("Nalgonda");
            farmer.setVillage("Choutuppal");
            farmer.setRegistrationDate(LocalDateTime.now());
            farmer.setBlocked(false);
            farmerRepository.save(farmer);
            System.out.println("Seeded default Farmer: Phone 917777777777");
        }
    }
}
