package com.skillswap.service;

import com.skillswap.aop.LogActivity;
import com.skillswap.aop.RateLimited;
import com.skillswap.dto.MatchDtos.MatchResponse;
import com.skillswap.entity.*;
import com.skillswap.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Core matching logic: finds mutual barter opportunities.
 * A match exists between user A and user B when A offers a skill
 * that B wants, AND B offers a skill that A wants (mutual barter).
 */
@Service
@RequiredArgsConstructor
public class MatchService {

    private final SkillOfferedRepository skillOfferedRepository;
    private final SkillWantedRepository skillWantedRepository;
    private final MatchRepository matchRepository;
    private final UserRepository userRepository;

    @RateLimited(maxRequests = 1000, windowSeconds = 60)
    @LogActivity(action = "MATCH_SEARCH_RUN")
    public List<MatchResponse> findMatchesForUser(Long userId) {
        List<SkillWanted> myWants = skillWantedRepository.findByUserId(userId);
        List<SkillOffered> myOffers = skillOfferedRepository.findByUserId(userId);
        User me = userRepository.findById(userId).orElseThrow();

        List<MatchResponse> results = new ArrayList<>();
        Set<Long> consideredUsers = new HashSet<>();

        System.out.println("My Wants: "+myWants);
        System.out.println("My Offers: "+myOffers);

        for (SkillWanted want : myWants) {
            // find others who offer what I want
            System.out.println("Looking for: "+want.getSkillName());
            List<SkillOffered> candidates = skillOfferedRepository.findBySkillNameIgnoreCase(want.getSkillName());
            System.out.println("Candidates Found: "+ candidates.size());
            for (SkillOffered candidate : candidates) {
;
                User other = candidate.getUser();
                if (other.getId().equals(userId) || consideredUsers.contains(other.getId())) continue;

                // check if they also want something I offer (mutual barter)
                System.out.println("Candidate User: "+other.getEmail());
                List<SkillWanted> theirWants = skillWantedRepository.findByUserId(other.getId());
                for (SkillWanted theirWant : theirWants) {
                    System.out.println(theirWant.getSkillName());
                    boolean iOfferIt = myOffers.stream()
                            .anyMatch(o -> o.getSkillName().equalsIgnoreCase(theirWant.getSkillName()));
                    if (iOfferIt) {
                        consideredUsers.add(other.getId());
                        Match match = Match.builder()
                                .userA(me)
                                .userB(other)
                                .skillFromAToB(theirWant.getSkillName())
                                .skillFromBToA(want.getSkillName())
                                .status("PENDING")
                                .build();
                        matchRepository.save(match);
                        results.add(toResponse(match));
                        break;
                    }
                }
            }
        }
        return results;
    }

    public List<MatchResponse> myMatches(Long userId) {
        return matchRepository.findByUserAIdOrUserBId(userId, userId)
                .stream().map(this::toResponse).toList();
    }

    public MatchResponse updateStatus(Long matchId, String status) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new IllegalArgumentException("Match not found"));
        match.setStatus(status);
        System.out.println("Match Created");
        matchRepository.save(match);
        return toResponse(match);
    }

    private MatchResponse toResponse(Match m) {
        return new MatchResponse(
                m.getId(),
                m.getUserA().getId(), m.getUserA().getFullName(),
                m.getUserB().getId(), m.getUserB().getFullName(),
                m.getSkillFromAToB(), m.getSkillFromBToA(),
                m.getStatus()
        );
    }
}
