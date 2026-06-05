package com.kisanurea.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public Map<String, Object> index() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "running");
        response.put("message", "Welcome to KisanUrea API Server");
        response.put("version", "1.0.0");
        response.put("api_endpoints", new String[]{
            "/api/farmers",
            "/api/dealers",
            "/api/bookings",
            "/api/reports"
        });
        response.put("frontend_url", "http://localhost:5173");
        return response;
    }
}
