package com.ticketforge.academy.repository;

import com.ticketforge.academy.entity.AcademyCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AcademyCertificateRepository extends JpaRepository<AcademyCertificate, Long> {
    Optional<AcademyCertificate> findByUserIdAndCertificationId(Long userId, String certificationId);
}
