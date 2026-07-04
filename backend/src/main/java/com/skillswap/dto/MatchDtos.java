package com.skillswap.dto;

public class MatchDtos {

    public record MatchResponse(
            Long id,
            Long userAId, String userAName,
            Long userBId, String userBName,
            String skillFromAToB,
            String skillFromBToA,
            String status
    ) {}

    public record SessionRequest(
            Long matchId,
            String scheduledAt, // ISO datetime string
            String notes
    ) {}
}
