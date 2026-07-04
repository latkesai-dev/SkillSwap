package com.skillswap.service;

import com.skillswap.aop.LogActivity;
import com.skillswap.dto.SkillDtos.*;
import com.skillswap.entity.SkillOffered;
import com.skillswap.entity.SkillWanted;
import com.skillswap.entity.User;
import com.skillswap.repository.SkillOfferedRepository;
import com.skillswap.repository.SkillWantedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillOfferedRepository skillOfferedRepository;
    private final SkillWantedRepository skillWantedRepository;

    @LogActivity(action = "SKILL_OFFERED")
    public SkillOfferedResponse offerSkill(User user, OfferSkillRequest request) {
        SkillOffered skill = SkillOffered.builder()
                .skillName(request.skillName())
                .description(request.description())
                .proficiencyLevel(request.proficiencyLevel())
                .user(user)
                .build();
        skillOfferedRepository.save(skill);
        return toResponse(skill);
    }

    public SkillWanted wantSkill(User user, WantSkillRequest request) {
        SkillWanted skill = SkillWanted.builder()
                .skillName(request.skillName())
                .description(request.description())
                .user(user)
                .build();
        return skillWantedRepository.save(skill);
    }

    public List<SkillOfferedResponse> browseAll() {
        return skillOfferedRepository.findAll().stream().map(this::toResponse).toList();
    }

    public List<SkillOffered> myOfferedSkills(Long userId) {
        return skillOfferedRepository.findByUserId(userId);
    }

    public List<SkillWanted> myWantedSkills(Long userId) {
        return skillWantedRepository.findByUserId(userId);
    }

    private SkillOfferedResponse toResponse(SkillOffered s) {
        return new SkillOfferedResponse(
                s.getId(), s.getSkillName(), s.getDescription(),
                s.getProficiencyLevel(), s.getUser().getId(), s.getUser().getFullName()
        );
    }
}
