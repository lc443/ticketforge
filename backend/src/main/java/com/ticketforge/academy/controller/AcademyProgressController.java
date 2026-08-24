package com.ticketforge.academy.controller;

import com.ticketforge.academy.dto.CertificationProgressResponse;
import com.ticketforge.academy.dto.ExerciseCompletionRequest;
import com.ticketforge.academy.service.AcademyProgressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/academy/certifications")
@RequiredArgsConstructor
public class AcademyProgressController {

    private final AcademyProgressService academyProgressService;

    @GetMapping("/{certificationId}/progress")
    public CertificationProgressResponse findProgress(
            @PathVariable String certificationId,
            Principal principal
    ) {
        return academyProgressService.findProgress(certificationId, principal.getName());
    }

    @PutMapping("/{certificationId}/exercises/{exerciseId}")
    public CertificationProgressResponse setCompletion(
            @PathVariable String certificationId,
            @PathVariable String exerciseId,
            @Valid @RequestBody ExerciseCompletionRequest request,
            Principal principal
    ) {
        return academyProgressService.setCompletion(
                certificationId,
                exerciseId,
                request.completed(),
                principal.getName()
        );
    }
}
