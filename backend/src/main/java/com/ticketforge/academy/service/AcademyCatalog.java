package com.ticketforge.academy.service;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.stream.IntStream;

final class AcademyCatalog {
    static final String CLF_C02 = "aws-clf-c02";

    private static final Set<String> CLF_C02_REQUIREMENTS = buildClfRequirements();

    private AcademyCatalog() {}

    static Set<String> requirementsFor(String certificationId) {
        if (!CLF_C02.equals(certificationId)) {
            throw new IllegalArgumentException("Unknown certification path: " + certificationId);
        }
        return CLF_C02_REQUIREMENTS;
    }

    private static Set<String> buildClfRequirements() {
        LinkedHashSet<String> requirements = new LinkedHashSet<>();
        IntStream.rangeClosed(1, 21)
                .mapToObj(day -> "study-day-%02d".formatted(day))
                .forEach(requirements::add);
        requirements.addAll(Set.of(
                "lab-zero-root-boundary",
                "lab-zero-daily-identity",
                "lab-zero-cli-identity",
                "lab-zero-cost-controls",
                "lab-zero-tagging-contract",
                "lab-zero-cleanup-contract",
                "cloud-foundations-cloud-value",
                "cloud-foundations-global-infrastructure",
                "cloud-foundations-cli-regions",
                "cloud-foundations-shared-responsibility",
                "cloud-foundations-architecture-defense"
        ));
        return Set.copyOf(requirements);
    }
}
