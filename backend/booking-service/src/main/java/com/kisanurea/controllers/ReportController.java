package com.kisanurea.controllers;

import com.kisanurea.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/crisis")
    public ResponseEntity<Map<String, Object>> getCrisisReport() {
        return ResponseEntity.ok(reportService.getCrisisReport());
    }
}
