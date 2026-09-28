package com.example.lostpetfinder.service;

import com.example.lostpetfinder.entity.FoundAnimalReport;
import com.example.lostpetfinder.entity.LostPetReport;
import com.example.lostpetfinder.repository.FoundAnimalReportRepository;
import com.example.lostpetfinder.repository.LostPetReportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchService {

    private final LostPetReportRepository lostPetReportRepository;
    private final FoundAnimalReportRepository foundAnimalReportRepository;

    public MatchService(
            LostPetReportRepository lostPetReportRepository,
            FoundAnimalReportRepository foundAnimalReportRepository) {

        this.lostPetReportRepository = lostPetReportRepository;
        this.foundAnimalReportRepository = foundAnimalReportRepository;
    }

    public List<FoundAnimalReport> findMatches(Long lostPetId) {

        LostPetReport lostPet = lostPetReportRepository.findById(lostPetId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Lost pet report not found with id: " + lostPetId));

        if ("RESOLVED".equalsIgnoreCase(lostPet.getStatus())) {
            throw new RuntimeException(
                    "Resolved lost pet report cannot have active matches");
        }

        return foundAnimalReportRepository
        .findBySpeciesIgnoreCaseAndColorIgnoreCaseAndLocalityIgnoreCaseAndStatusIgnoreCase(
                lostPet.getSpecies(),
                lostPet.getColor(),
                lostPet.getLocality(),
                "ACTIVE"
        );
   }
}