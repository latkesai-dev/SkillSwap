package com.skillswap.repository;

import com.skillswap.entity.SkillOffered;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillOfferedRepository extends JpaRepository<SkillOffered, Long> {
    List<SkillOffered> findByUserId(Long userId);
    List<SkillOffered> findBySkillNameIgnoreCase(String skillName);
}
