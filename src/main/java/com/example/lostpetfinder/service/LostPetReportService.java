package com.example.lostpetfinder.service;

import com.example.lostpetfinder.entity.LostPetReport;
import com.example.lostpetfinder.repository.LostPetReportRepository;
import com.example.lostpetfinder.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LostPetReportService {

    private final LostPetReportRepository lostPetReportRepository;
    private final UserRepository userRepository;

    public LostPetReportService(LostPetReportRepository lostPetReportRepository,
                                UserRepository userRepository) {
        this.lostPetReportRepository = lostPetReportRepository;
        this.userRepository = userRepository;
    }

    public LostPetReport createReport(LostPetReport report) {

        if (report.getUser() == null || report.getUser().getId() == null) {
            throw new RuntimeException("User is required to create a lost pet report");
        }

        var user = userRepository.findById(report.getUser().getId())
                .orElseThrow(() -> new RuntimeException(
                        "User not found with id: " + report.getUser().getId()));

        report.setUser(user);
        report.setStatus("ACTIVE");
        report.setReportedDate(LocalDateTime.now());

        return lostPetReportRepository.save(report);
    }

    public List<LostPetReport> getAllReports() {
        return lostPetReportRepository.findAll();
    }

    public LostPetReport getReportById(Long id) {
        return lostPetReportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Lost pet report not found with id: " + id));
    }

    public List<LostPetReport> searchByLocality(String locality) {
        return lostPetReportRepository.findByLocalityIgnoreCase(locality);
    }

    public LostPetReport resolveReport(Long id) {

        LostPetReport report = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(report.getStatus())) {
            throw new RuntimeException("Lost pet report is already resolved");
        }

        report.setStatus("RESOLVED");

        return lostPetReportRepository.save(report);
    }

    public LostPetReport updateReport(Long id, LostPetReport updatedReport) {

        LostPetReport existingReport = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(existingReport.getStatus())) {
            throw new RuntimeException(
                    "Resolved report cannot be modified");
        }

        existingReport.setSpecies(updatedReport.getSpecies());
        existingReport.setBreed(updatedReport.getBreed());
        existingReport.setColor(updatedReport.getColor());
        existingReport.setLocality(updatedReport.getLocality());
        existingReport.setLastSeenLocation(updatedReport.getLastSeenLocation());

        return lostPetReportRepository.save(existingReport);
    }

    public void deleteReport(Long id) {

        LostPetReport report = getReportById(id);

        if ("RESOLVED".equalsIgnoreCase(report.getStatus())) {
            throw new RuntimeException(
                    "Resolved report cannot be deleted");
        }

        lostPetReportRepository.delete(report);
    }
}