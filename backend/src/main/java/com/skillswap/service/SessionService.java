package com.skillswap.service;

import com.skillswap.aop.LogActivity;
import com.skillswap.aop.RateLimited;
import com.skillswap.entity.Match;
import com.skillswap.entity.Session;
import com.skillswap.repository.MatchRepository;
import com.skillswap.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessionService {

    private final SessionRepository sessionRepository;
    private final MatchRepository matchRepository;

    @LogActivity(action = "SESSION_BOOKED")
    public Session bookSession(Long matchId, String scheduledAt, String notes) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));

        if (!match.getStatus().equals("ACCEPTED")) {
            throw new IllegalArgumentException("Can only book sessions for accepted matches");
        }

        Session session = Session.builder()
                .match(match)
                .scheduledAt(LocalDateTime.parse(scheduledAt))
                .notes(notes)
                .status("SCHEDULED")
                .build();

        return sessionRepository.save(session);
    }



    public List<Session> getSessionsForMatch(Long matchId) {
        return sessionRepository.findByMatchId(matchId);
    }

    @LogActivity(action = "SESSION_STATUS_UPDATED")
    public Session updateStatus(Long sessionId, String status) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        session.setStatus(status);
        return sessionRepository.save(session);
    }
}
