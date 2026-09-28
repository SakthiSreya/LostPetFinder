package com.example.lostpetfinder.service;

import com.example.lostpetfinder.entity.FoundAnimalReport;
import com.example.lostpetfinder.repository.FoundAnimalReportRepository;
import com.example.lostpetfinder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FoundAnimalReportService {

    private final FoundAnimalReportRepository foundAnimalReportRepository;
    private final UserRepository userRepository;

    public FoundAnimalReportService(
            FoundAnimalReportRepository foundAnimalReportRepository,
            UserRepository userRepository) {

        this.foundAnimalReportRepository = foundAnimalReportRepository;
        this.userRepository = userRepository;
    }

    public FoundAnimalReport createReport(FoundAnimalReport report) {

        if (report.getUser() == null || report.getUser().getId() == null) {
            throw new RuntimeException(
                    "User is required to create a found animal report");
        }

        var user = userRepository.findById(report.getUser().getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id: "
                                        + report.getUser().getId()));

        report.setUser(user);
        report.setStatus("ACTIVE");
        report.setReportedDate(LocalDateTime.now());

        return foundAnimalReportRepository.save(report);
    }

    public List<FoundAnimalReport> getAllReports() {
        return foundAnimalReportRepository.findAll();
    }

    public FoundAnimalReport getReportById(Long id) {

        return foundAnimalReportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Found animal report not found with id: "
                                        + id));
    }

    public List<FoundAnimalReport> searchByLocality(String locality) {

        return foundAnimalReportRepository
                .findByLocalityIgnoreCase(locality);
    }

    public FoundAnimalReport resolveReport(Long id) {

        FoundAnimalReport report = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(report.getStatus())) {
            throw new RuntimeException(
                    "Found animal report is already resolved");
        }

        report.setStatus("RESOLVED");

        return foundAnimalReportRepository.save(report);
    }

    public FoundAnimalReport updateReport(
            Long id,
            FoundAnimalReport updatedReport) {

        FoundAnimalReport existingReport = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(existingReport.getStatus())) {
            throw new RuntimeException(
                    "Resolved report cannot be modified");
        }

        existingReport.setSpecies(updatedReport.getSpecies());
        existingReport.setBreed(updatedReport.getBreed());
        existingReport.setColor(updatedReport.getColor());
        existingReport.setLocality(updatedReport.getLocality());
        existingReport.setFoundLocation(updatedReport.getFoundLocation());

        return foundAnimalReportRepository.save(existingReport);
    }

    public void deleteReport(Long id) {

        FoundAnimalReport report = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(report.getStatus())) {
            throw new RuntimeException(
                    "Resolved report cannot be deleted");
        }

        foundAnimalReportRepository.delete(report);
    }
}