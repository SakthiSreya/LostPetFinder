package com.example.lostpetfinder.controller;

import com.example.lostpetfinder.entity.FoundAnimalReport;
import com.example.lostpetfinder.service.MatchService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matches")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @GetMapping("/{lostPetId}")
    public List<FoundAnimalReport> findMatches(
            @PathVariable Long lostPetId) {
        return matchService.findMatches(lostPetId);
    }
}