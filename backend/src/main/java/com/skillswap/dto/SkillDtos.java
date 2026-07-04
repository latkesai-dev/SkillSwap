package com.skillswap.dto;

import jakarta.validation.constraints.NotBlank;

public class SkillDtos {

    public record OfferSkillRequest(
            @NotBlank String skillName,
            String description,
            @NotBlank String proficiencyLevel
    ) {}

    public record WantSkillRequest(
            @NotBlank String skillName,
            String description
    ) {}

    public record SkillOfferedResponse(
            Long id, String skillName, String description,
            String proficiencyLevel, Long userId, String userFullName
    ) {}
}
