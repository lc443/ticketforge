package com.ticketforge.academy.entity;

import com.ticketforge.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "academy_certificates",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_academy_certificate_user_cert", columnNames = {"user_id", "certification_id"}),
                @UniqueConstraint(name = "uk_academy_certificate_number", columnNames = "certificate_number")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AcademyCertificate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "certification_id", nullable = false, length = 80)
    private String certificationId;

    @Column(name = "certificate_number", nullable = false, length = 80)
    private String certificateNumber;

    @Column(name = "completed_at", nullable = false, updatable = false)
    private Instant completedAt;
}
