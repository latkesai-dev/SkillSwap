package com.skillswap.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_a_id", nullable = false)
    private User userA;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_b_id", nullable = false)
    private User userB;

    @Column(nullable = false)
    private String skillFromAToB; // skill A teaches B

    @Column(nullable = false)
    private String skillFromBToA; // skill B teaches A

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, COMPLETED

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
