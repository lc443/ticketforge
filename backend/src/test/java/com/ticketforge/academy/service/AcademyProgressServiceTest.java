package com.ticketforge.academy.service;

import com.ticketforge.academy.dto.CertificationProgressResponse;
import com.ticketforge.academy.entity.AcademyCertificate;
import com.ticketforge.academy.entity.AcademyExerciseProgress;
import com.ticketforge.academy.repository.AcademyCertificateRepository;
import com.ticketforge.academy.repository.AcademyExerciseProgressRepository;
import com.ticketforge.academy.repository.AcademyQuizAttemptRepository;
import com.ticketforge.auth.entity.Role;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AcademyProgressServiceTest {

    private static final String EMAIL = "learner@example.com";

    @Mock AcademyExerciseProgressRepository progressRepository;
    @Mock AcademyCertificateRepository certificateRepository;
    @Mock AcademyQuizAttemptRepository quizAttemptRepository;
    @Mock UserRepository userRepository;
    @InjectMocks AcademyProgressService service;

    @Test
    void completionIsAssignedToAuthenticatedLearnerAndRetainsHistory() {
        User learner = learner();
        when(userRepository.findByEmailForUpdate(EMAIL)).thenReturn(Optional.of(learner));
        when(progressRepository.findByUserIdAndCertificationIdAndExerciseId(
                7L, "aws-clf-c02", "study-day-01"
        )).thenReturn(Optional.empty());
        when(progressRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(progressRepository.findAllByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenAnswer(invocation -> List.of());
        when(certificateRepository.findByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenReturn(Optional.empty());

        service.setCompletion("aws-clf-c02", "study-day-01", true, EMAIL);

        verify(progressRepository).save(argThat(progress ->
                progress.getUser() == learner
                        && progress.isCompleted()
                        && progress.getFirstCompletedAt() != null
                        && progress.getLastCompletedAt() != null
                        && progress.getUpdatedAt() != null
        ));
    }

    @Test
    void unknownExerciseCannotCreateProgress() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> service.setCompletion("aws-clf-c02", "made-up-exercise", true, EMAIL)
        );

        assertTrue(exception.getMessage().contains("does not belong"));
        verifyNoInteractions(userRepository, progressRepository, certificateRepository);
    }

    @Test
    void finalRequirementIssuesOneTicketForgeCertificate() {
        User learner = learner();
        List<AcademyExerciseProgress> rows = completedRows(learner);
        when(userRepository.findByEmailForUpdate(EMAIL)).thenReturn(Optional.of(learner));
        when(progressRepository.findByUserIdAndCertificationIdAndExerciseId(
                7L, "aws-clf-c02", "study-day-21"
        )).thenReturn(Optional.of(rows.stream()
                .filter(row -> row.getExerciseId().equals("study-day-21"))
                .findFirst().orElseThrow()));
        when(progressRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(progressRepository.findAllByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenReturn(rows);
        when(certificateRepository.findByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenReturn(Optional.empty());
        when(certificateRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        service.setCompletion("aws-clf-c02", "study-day-21", true, EMAIL);

        verify(certificateRepository).save(argThat(certificate ->
                certificate.getUser() == learner
                        && certificate.getCertificateNumber().startsWith("TF-CLF-C02-")
                        && certificate.getCompletedAt() != null
        ));
    }

    @Test
    void issuedCertificateIsReturnedButNeverReissued() {
        User learner = learner();
        AcademyCertificate certificate = AcademyCertificate.builder()
                .user(learner)
                .certificationId("aws-clf-c02")
                .certificateNumber("TF-CLF-C02-EXISTING")
                .completedAt(Instant.parse("2026-08-24T12:00:00Z"))
                .build();
        AcademyExerciseProgress row = progress(learner, "study-day-01", true);
        when(userRepository.findByEmailForUpdate(EMAIL)).thenReturn(Optional.of(learner));
        when(progressRepository.findByUserIdAndCertificationIdAndExerciseId(
                7L, "aws-clf-c02", "study-day-01"
        )).thenReturn(Optional.of(row));
        when(progressRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
        when(progressRepository.findAllByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenReturn(List.of(row));
        when(certificateRepository.findByUserIdAndCertificationId(7L, "aws-clf-c02"))
                .thenReturn(Optional.of(certificate));

        CertificationProgressResponse response = service.setCompletion(
                "aws-clf-c02", "study-day-01", false, EMAIL
        );

        assertEquals("TF-CLF-C02-EXISTING", response.certificate().certificateNumber());
        verify(certificateRepository, never()).save(any());
    }

    private User learner() {
        return User.builder().id(7L).firstName("Academy").lastName("Learner")
                .email(EMAIL).password("encoded").role(Role.USER).build();
    }

    private List<AcademyExerciseProgress> completedRows(User learner) {
        List<AcademyExerciseProgress> rows = new ArrayList<>();
        AcademyCatalog.requirementsFor("aws-clf-c02")
                .forEach(id -> rows.add(progress(learner, id, true)));
        return rows;
    }

    private AcademyExerciseProgress progress(User learner, String exerciseId, boolean completed) {
        Instant now = Instant.parse("2026-08-24T12:00:00Z");
        return AcademyExerciseProgress.builder()
                .user(learner)
                .certificationId("aws-clf-c02")
                .exerciseId(exerciseId)
                .completed(completed)
                .firstCompletedAt(now)
                .lastCompletedAt(now)
                .updatedAt(now)
                .build();
    }
}
