package com.ticketforge.academy.repository;

import com.ticketforge.academy.entity.AcademyQuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AcademyQuizAttemptRepository extends JpaRepository<AcademyQuizAttempt, Long> {
    List<AcademyQuizAttempt> findAllByUserIdAndCertificationIdOrderBySubmittedAtDesc(Long userId, String certificationId);
}
