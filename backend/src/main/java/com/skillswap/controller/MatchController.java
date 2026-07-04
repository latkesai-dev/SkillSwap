package com.skillswap.controller;

import com.skillswap.dto.MatchDtos.MatchResponse;
import com.skillswap.entity.User;
import com.skillswap.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService;

    @PostMapping("/search")
    public List<MatchResponse> search(@AuthenticationPrincipal User user) {
        return matchService.findMatchesForUser(user.getId());
    }

    @GetMapping
    public List<MatchResponse> myMatches(@AuthenticationPrincipal User user) {
        return matchService.myMatches(user.getId());
    }

    @PutMapping("/{id}/status")
    public MatchResponse updateStatus(@PathVariable Long id, @RequestParam String status) {
        return matchService.updateStatus(id, status);
    }
}
