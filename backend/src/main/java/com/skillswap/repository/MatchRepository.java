package com.skillswap.repository;

import com.skillswap.entity.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByUserAIdOrUserBId(Long userAId, Long userBId);
}
