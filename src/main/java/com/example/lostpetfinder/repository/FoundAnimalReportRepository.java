package com.example.lostpetfinder.repository;

import com.example.lostpetfinder.entity.FoundAnimalReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoundAnimalReportRepository extends JpaRepository<FoundAnimalReport, Long> {

    List<FoundAnimalReport> findByLocalityIgnoreCase(String locality);

    List<FoundAnimalReport> findBySpeciesIgnoreCaseAndColorIgnoreCaseAndLocalityIgnoreCaseAndStatusIgnoreCase(
            String species,
            String color,
            String locality,
            String status
    );
}