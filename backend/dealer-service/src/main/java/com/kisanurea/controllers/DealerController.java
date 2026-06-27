package com.kisanurea.controllers;

import com.kisanurea.models.Dealer;
import com.kisanurea.services.DealerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/dealers")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PATCH, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class DealerController {

    @Autowired
    private DealerService dealerService;

    @PostMapping("/register")
    public ResponseEntity<Dealer> register(@RequestBody Dealer dealer) {
        java.util.Objects.requireNonNull(dealer);
        return ResponseEntity.ok(dealerService.registerDealer(dealer));
    }

    @PostMapping("/login")
    public ResponseEntity<Dealer> login(@RequestBody java.util.Map<String, String> loginData) {
        String shopId = java.util.Objects.requireNonNull(loginData.get("shopId"));
        String password = java.util.Objects.requireNonNull(loginData.get("password"));
        return ResponseEntity.ok(dealerService.login(shopId, password));
    }

    @PostMapping("/{id}/stock")
    public ResponseEntity<Dealer> updateStock(
            @PathVariable String id,
            @RequestParam double quantity,
            @RequestParam String type,
            @RequestParam(required = false) String farmerId) {
        java.util.Objects.requireNonNull(id);
        java.util.Objects.requireNonNull(type);
        return ResponseEntity.ok(dealerService.updateStock(id, quantity, type, farmerId));
    }

    @GetMapping
    public ResponseEntity<List<Dealer>> getAll() {
        return ResponseEntity.ok(dealerService.getAllDealers());
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<Dealer>> getNearbyDealers(@RequestParam String state, @RequestParam String district) {
        return ResponseEntity.ok(dealerService.getNearbyDealers(state, district));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dealer> updateDealer(@PathVariable String id, @RequestBody Dealer dealerDetails) {
        java.util.Objects.requireNonNull(id);
        java.util.Objects.requireNonNull(dealerDetails);
        return ResponseEntity.ok(dealerService.updateDealerDetails(id, dealerDetails));
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<Dealer> blockDealer(@PathVariable String id, @RequestParam boolean blocked) {
        java.util.Objects.requireNonNull(id);
        return ResponseEntity.ok(dealerService.blockDealer(id, blocked));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDealer(@PathVariable String id) {
        java.util.Objects.requireNonNull(id);
        dealerService.deleteDealerCompletely(id);
        return ResponseEntity.ok(Map.of("message", "Dealer deleted permanently"));
    }
}

