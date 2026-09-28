package com.example.lostpetfinder.controller;

import com.example.lostpetfinder.entity.FoundAnimalReport;
import com.example.lostpetfinder.service.FoundAnimalReportService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/found-animals")
public class FoundAnimalReportController {

    private final FoundAnimalReportService foundAnimalReportService;

    public FoundAnimalReportController(
            FoundAnimalReportService foundAnimalReportService) {
        this.foundAnimalReportService = foundAnimalReportService;
    }

    @PostMapping
    public FoundAnimalReport createReport(
            @Valid @RequestBody FoundAnimalReport report) {
        return foundAnimalReportService.createReport(report);
    }

    @GetMapping
    public List<FoundAnimalReport> getAllReports() {
        return foundAnimalReportService.getAllReports();
    }

    @GetMapping("/{id}")
    public FoundAnimalReport getReportById(@PathVariable Long id) {
        return foundAnimalReportService.getReportById(id);
    }

    @GetMapping("/search")
    public List<FoundAnimalReport> searchByLocality(
            @RequestParam String locality) {
        return foundAnimalReportService.searchByLocality(locality);
    }

    @PutMapping("/{id}")
    public FoundAnimalReport updateReport(
            @PathVariable Long id,
            @Valid @RequestBody FoundAnimalReport report) {
        return foundAnimalReportService.updateReport(id, report);
    }

    @PutMapping("/{id}/resolve")
    public FoundAnimalReport resolveReport(@PathVariable Long id) {
        return foundAnimalReportService.resolveReport(id);
    }

    @DeleteMapping("/{id}")
    public String deleteReport(@PathVariable Long id) {
        foundAnimalReportService.deleteReport(id);
        return "Found animal report deleted successfully";
    }
}