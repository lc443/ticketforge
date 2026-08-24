export interface AcademyExerciseProgress {
  exerciseId: string;
  completed: boolean;
  firstCompletedAt: string | null;
  lastCompletedAt: string | null;
  updatedAt: string;
}

export interface AcademyCertificate {
  certificateNumber: string;
  title: string;
  certificationId: string;
  completedAt: string;
}

export interface CertificationProgress {
  certificationId: string;
  learnerEmail: string;
  completedExercises: number;
  requiredExercises: number;
  progressPercent: number;
  exercises: AcademyExerciseProgress[];
  certificate: AcademyCertificate | null;
}
