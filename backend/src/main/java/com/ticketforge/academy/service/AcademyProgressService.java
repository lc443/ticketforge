package com.ticketforge.academy.service;

import com.ticketforge.academy.dto.*;
import com.ticketforge.academy.entity.AcademyCertificate;
import com.ticketforge.academy.entity.AcademyExerciseProgress;
import com.ticketforge.academy.repository.AcademyCertificateRepository;
import com.ticketforge.academy.repository.AcademyExerciseProgressRepository;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AcademyProgressService {

    private static final String CERTIFICATE_TITLE = "TicketForge Academy Certificate of Completion";

    private final AcademyExerciseProgressRepository progressRepository;
    private final AcademyCertificateRepository certificateRepository;
    private final com.ticketforge.academy.repository.AcademyQuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CertificationProgressResponse findProgress(String certificationId, String learnerEmail) {
        Set<String> requirements = AcademyCatalog.requirementsFor(certificationId);
        User learner = findLearner(learnerEmail);
        return response(learner, certificationId, requirements);
    }

    @Transactional
    public CertificationProgressResponse setCompletion(
            String certificationId,
            String exerciseId,
            boolean completed,
            String learnerEmail
    ) {
        Set<String> requirements = AcademyCatalog.requirementsFor(certificationId);
        if (!requirements.contains(exerciseId)) {
            throw new IllegalArgumentException(
                    "Exercise " + exerciseId + " does not belong to " + certificationId + "."
            );
        }

        // Lock the learner row so concurrent clicks for the same learner cannot
        // race certificate issuance or create duplicate progress rows.
        User learner = userRepository.findByEmailForUpdate(learnerEmail)
                .orElseThrow(() -> new NotFoundException("Authenticated user was not found."));
        Instant now = Instant.now();

        AcademyExerciseProgress progress = progressRepository
                .findByUserIdAndCertificationIdAndExerciseId(learner.getId(), certificationId, exerciseId)
                .orElseGet(() -> AcademyExerciseProgress.builder()
                        .user(learner)
                        .certificationId(certificationId)
                        .exerciseId(exerciseId)
                        .build());

        progress.setCompleted(completed);
        progress.setUpdatedAt(now);
        if (completed) {
            if (progress.getFirstCompletedAt() == null) {
                progress.setFirstCompletedAt(now);
            }
            progress.setLastCompletedAt(now);
        }
        progressRepository.save(progress);

        issueCertificateIfEligible(learner, certificationId, requirements, now);
        return response(learner, certificationId, requirements);
    }

    private void issueCertificateIfEligible(
            User learner,
            String certificationId,
            Set<String> requirements,
            Instant completedAt
    ) {
        if (certificateRepository.findByUserIdAndCertificationId(learner.getId(), certificationId).isPresent()) {
            return;
        }

        Set<String> completed = completedExerciseIds(learner.getId(), certificationId);
        if (!completed.containsAll(requirements)) {
            return;
        }

        certificateRepository.save(AcademyCertificate.builder()
                .user(learner)
                .certificationId(certificationId)
                .certificateNumber("TF-CLF-C02-" + UUID.randomUUID().toString().substring(0, 12).toUpperCase(Locale.ROOT))
                .completedAt(completedAt)
                .build());
    }

    private CertificationProgressResponse response(
            User learner,
            String certificationId,
            Set<String> requirements
    ) {
        List<AcademyExerciseProgress> rows = progressRepository
                .findAllByUserIdAndCertificationId(learner.getId(), certificationId);
        List<ExerciseProgressResponse> exercises = rows.stream()
                .sorted(Comparator.comparing(AcademyExerciseProgress::getExerciseId))
                .map(this::exerciseResponse)
                .toList();
        int completed = (int) rows.stream().filter(AcademyExerciseProgress::isCompleted).count();
        int passedQuizModules = (int) quizAttemptRepository
                .findAllByUserIdAndCertificationIdOrderBySubmittedAtDesc(learner.getId(), certificationId).stream()
                .filter(com.ticketforge.academy.entity.AcademyQuizAttempt::isPassed)
                .map(com.ticketforge.academy.entity.AcademyQuizAttempt::getModuleId)
                .distinct()
                .count();
        int xp = completed * 10 + passedQuizModules * 25;
        int maximumXp = requirements.size() * 10 + 21 * 25;
        CertificateResponse certificate = certificateRepository
                .findByUserIdAndCertificationId(learner.getId(), certificationId)
                .map(this::certificateResponse)
                .orElse(null);

        return new CertificationProgressResponse(
                certificationId,
                learner.getEmail(),
                completed,
                requirements.size(),
                Math.round(completed * 100f / requirements.size()),
                xp,
                maximumXp,
                passedQuizModules,
                exercises,
                certificate
        );
    }

    private Set<String> completedExerciseIds(Long userId, String certificationId) {
        Set<String> completed = new HashSet<>();
        progressRepository.findAllByUserIdAndCertificationId(userId, certificationId).stream()
                .filter(AcademyExerciseProgress::isCompleted)
                .map(AcademyExerciseProgress::getExerciseId)
                .forEach(completed::add);
        return completed;
    }

    private User findLearner(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Authenticated user was not found."));
    }

    private ExerciseProgressResponse exerciseResponse(AcademyExerciseProgress progress) {
        return new ExerciseProgressResponse(
                progress.getExerciseId(),
                progress.isCompleted(),
                progress.getFirstCompletedAt(),
                progress.getLastCompletedAt(),
                progress.getUpdatedAt()
        );
    }

    private CertificateResponse certificateResponse(AcademyCertificate certificate) {
        return new CertificateResponse(
                certificate.getCertificateNumber(),
                CERTIFICATE_TITLE,
                certificate.getCertificationId(),
                certificate.getCompletedAt()
        );
    }
}
