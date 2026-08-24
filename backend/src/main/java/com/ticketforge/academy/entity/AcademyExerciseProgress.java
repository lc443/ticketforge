package com.ticketforge.academy.entity;

import com.ticketforge.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "academy_exercise_progress",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_academy_progress_user_cert_exercise",
                columnNames = {"user_id", "certification_id", "exercise_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademyExerciseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "certification_id", nullable = false, length = 80)
    private String certificationId;

    @Column(name = "exercise_id", nullable = false, length = 120)
    private String exerciseId;

    @Column(nullable = false)
    private boolean completed;

    @Column(name = "first_completed_at")
    private Instant firstCompletedAt;

    @Column(name = "last_completed_at")
    private Instant lastCompletedAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}
