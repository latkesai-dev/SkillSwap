package com.skillswap.controller;

import com.skillswap.dto.SkillDtos.*;
import com.skillswap.entity.User;
import com.skillswap.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping("/offer")
    public SkillOfferedResponse offer(@AuthenticationPrincipal User user,
                                       @Valid @RequestBody OfferSkillRequest request) {
        return skillService.offerSkill(user, request);
    }

    @PostMapping("/want")
    public Object want(@AuthenticationPrincipal User user,
                        @Valid @RequestBody WantSkillRequest request) {
        return skillService.wantSkill(user, request);
    }

    @GetMapping("/browse")
    public List<SkillOfferedResponse> browse() {
        return skillService.browseAll();
    }

    @GetMapping("/mine")
    public Map<String, Object> mine(@AuthenticationPrincipal User user) {
        return Map.of(
                "offered", skillService.myOfferedSkills(user.getId()),
                "wanted", skillService.myWantedSkills(user.getId())
        );
    }
}
