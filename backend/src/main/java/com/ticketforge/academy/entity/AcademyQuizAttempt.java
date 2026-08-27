package com.ticketforge.academy.entity;

import com.ticketforge.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "academy_quiz_attempts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AcademyQuizAttempt {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "user_id", nullable = false) private User user;
    @Column(name = "certification_id", nullable = false, length = 80) private String certificationId;
    @Column(name = "module_id", nullable = false, length = 120) private String moduleId;
    @Column(nullable = false) private int correctAnswers;
    @Column(nullable = false) private int totalQuestions;
    @Column(nullable = false) private int scorePercent;
    @Column(nullable = false) private boolean passed;
    @Column(nullable = false) private Instant submittedAt;
}
