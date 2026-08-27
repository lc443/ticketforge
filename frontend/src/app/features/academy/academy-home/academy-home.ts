import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CERTIFICATION_PATHS, CertificationStatus } from '../../../shared/data/certification-paths';

@Component({
  selector: 'app-academy-home',
  standalone: true,
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './academy-home.html',
  styleUrl: './academy-home.scss',
})
export class AcademyHome {
  readonly paths = CERTIFICATION_PATHS;
  readonly statusLabel: Record<CertificationStatus, string> = {
    current: 'Current path',
    next: 'Up next',
    planned: 'Planned',
  };

  statusText(status: CertificationStatus): string {
    return this.statusLabel[status];
  }
}
