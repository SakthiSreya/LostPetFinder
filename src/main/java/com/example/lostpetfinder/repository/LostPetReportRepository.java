package com.example.lostpetfinder.repository;

import com.example.lostpetfinder.entity.LostPetReport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LostPetReportRepository extends JpaRepository<LostPetReport, Long> {

    List<LostPetReport> findByLocalityIgnoreCase(String locality);
}