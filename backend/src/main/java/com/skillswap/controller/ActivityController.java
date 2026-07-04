package com.skillswap.controller;

import com.skillswap.entity.ActivityLog;
import com.skillswap.repository.ActivityLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/activity")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityLogRepository activityLogRepository;

    @GetMapping("/recent")
    public List<ActivityLog> recent() {
        return activityLogRepository.findAll(
                PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "timestamp"))
        ).getContent();
    }
}
