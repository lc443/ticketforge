package com.ticketforge.academy.repository;

import com.ticketforge.academy.entity.AcademyExerciseProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AcademyExerciseProgressRepository extends JpaRepository<AcademyExerciseProgress, Long> {
    List<AcademyExerciseProgress> findAllByUserIdAndCertificationId(Long userId, String certificationId);
    Optional<AcademyExerciseProgress> findByUserIdAndCertificationIdAndExerciseId(
            Long userId,
            String certificationId,
            String exerciseId
    );
}
