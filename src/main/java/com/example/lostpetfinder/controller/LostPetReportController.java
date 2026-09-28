package com.example.lostpetfinder.controller;

import com.example.lostpetfinder.entity.LostPetReport;
import com.example.lostpetfinder.service.LostPetReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/lost-pets")
public class LostPetReportController {

    private final LostPetReportService lostPetReportService;

    public LostPetReportController(LostPetReportService lostPetReportService) {
        this.lostPetReportService = lostPetReportService;
    }

    @PostMapping
    public LostPetReport createReport(
            @Valid @RequestBody LostPetReport report) {
        return lostPetReportService.createReport(report);
    }

    @GetMapping
    public List<LostPetReport> getAllReports() {
        return lostPetReportService.getAllReports();
    }

    @GetMapping("/{id}")
    public LostPetReport getReportById(@PathVariable Long id) {
        return lostPetReportService.getReportById(id);
    }

    @GetMapping("/search")
    public List<LostPetReport> searchByLocality(
            @RequestParam String locality) {
        return lostPetReportService.searchByLocality(locality);
    }

    @PutMapping("/{id}")
    public LostPetReport updateReport(
            @PathVariable Long id,
            @Valid @RequestBody LostPetReport report) {
        return lostPetReportService.updateReport(id, report);
    }

    @PutMapping("/{id}/resolve")
    public LostPetReport resolveReport(@PathVariable Long id) {
        return lostPetReportService.resolveReport(id);
    }

    @DeleteMapping("/{id}")
    public String deleteReport(@PathVariable Long id) {
        lostPetReportService.deleteReport(id);
        return "Lost pet report deleted successfully";
    }
}