import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE } from './api-base';
import { CertificationProgress } from '../../shared/models/academy.model';

@Injectable({ providedIn: 'root' })
export class AcademyProgressService {
  constructor(private http: HttpClient) {}

  getProgress(certificationId: string) {
    return this.http.get<CertificationProgress>(
      `${API_BASE}/academy/certifications/${certificationId}/progress`,
    );
  }

  setExercise(certificationId: string, exerciseId: string, completed: boolean) {
    return this.http.put<CertificationProgress>(
      `${API_BASE}/academy/certifications/${certificationId}/exercises/${exerciseId}`,
      { completed },
    );
  }
}
