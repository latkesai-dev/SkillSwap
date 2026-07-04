package com.skillswap.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.*;

@Entity
@Table(name = "skills_offered")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SkillOffered {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String skillName;

    private String description;

    @Column(nullable = false)
    private String proficiencyLevel; // BEGINNER, INTERMEDIATE, EXPERT

    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
