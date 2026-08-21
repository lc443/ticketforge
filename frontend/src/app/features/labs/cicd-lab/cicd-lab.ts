import { Component } from '@angular/core';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';

@Component({
  selector: 'app-cicd-lab',
  standalone: true,
  imports: [LabBreadcrumb, ScenarioCard],
  templateUrl: './cicd-lab.html',
  styleUrl: './cicd-lab.scss',
})
export class CicdLab {}
