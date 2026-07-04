package com.skillswap.repository;

import com.skillswap.entity.SkillWanted;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillWantedRepository extends JpaRepository<SkillWanted, Long> {
    List<SkillWanted> findByUserId(Long userId);
}
