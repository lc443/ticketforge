package com.ticketforge.academy.service;

import com.ticketforge.academy.dto.*;
import com.ticketforge.academy.entity.AcademyQuizAttempt;
import com.ticketforge.academy.repository.AcademyQuizAttemptRepository;
import com.ticketforge.auth.entity.User;
import com.ticketforge.auth.repository.UserRepository;
import com.ticketforge.shared.error.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;

@Service @RequiredArgsConstructor
public class AcademyQuizService {
    private final AcademyQuizAttemptRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public QuizAttemptResponse record(String certificationId, String moduleId, QuizAttemptRequest request, String email) {
        if (request.correctAnswers() > request.totalQuestions()) throw new IllegalArgumentException("Correct answers cannot exceed total questions.");
        AcademyCatalog.requirementsFor(certificationId);
        if (!isKnownModule(moduleId)) throw new IllegalArgumentException("Quiz module " + moduleId + " does not belong to " + certificationId + ".");
        User learner = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Authenticated user was not found."));
        int score = Math.round(request.correctAnswers() * 100f / request.totalQuestions());
        return response(repository.save(AcademyQuizAttempt.builder().user(learner).certificationId(certificationId)
                .moduleId(moduleId).correctAnswers(request.correctAnswers()).totalQuestions(request.totalQuestions())
                .scorePercent(score).passed(score >= 67).submittedAt(Instant.now()).build()));
    }

    @Transactional(readOnly = true)
    public List<QuizAttemptResponse> findAll(String certificationId, String email) {
        AcademyCatalog.requirementsFor(certificationId);
        User learner = userRepository.findByEmail(email).orElseThrow(() -> new NotFoundException("Authenticated user was not found."));
        return repository.findAllByUserIdAndCertificationIdOrderBySubmittedAtDesc(learner.getId(), certificationId).stream().map(this::response).toList();
    }

    private QuizAttemptResponse response(AcademyQuizAttempt row) { return new QuizAttemptResponse(row.getId(), row.getModuleId(), row.getCorrectAnswers(), row.getTotalQuestions(), row.getScorePercent(), row.isPassed(), row.getSubmittedAt()); }
    private boolean isKnownModule(String moduleId) {
        if (moduleId.equals("lab-zero") || moduleId.equals("cloud-foundations")) return true;
        if (!moduleId.matches("study-day-\\d{2}")) return false;
        int day = Integer.parseInt(moduleId.substring(moduleId.length() - 2));
        return day >= 3 && day <= 21;
    }
}
