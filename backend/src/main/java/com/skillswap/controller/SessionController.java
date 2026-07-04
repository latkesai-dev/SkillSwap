package com.skillswap.controller;

import com.skillswap.dto.MatchDtos.SessionRequest;
import com.skillswap.entity.Session;
import com.skillswap.service.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @PostMapping
    public Session book(@RequestBody SessionRequest request) {
        return sessionService.bookSession(
                request.matchId(),
                request.scheduledAt(),
                request.notes()
        );
    }

    @GetMapping("/{matchId}")
    public List<Session> getForMatch(@PathVariable Long matchId) {
        return sessionService.getSessionsForMatch(matchId);
    }

    @PutMapping("/{id}/status")
    public Session updateStatus(@PathVariable Long id, @RequestParam String status) {
        return sessionService.updateStatus(id, status);
    }
}
