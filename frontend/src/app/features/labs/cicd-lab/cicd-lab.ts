import { Component } from '@angular/core';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

@Component({
  selector: 'app-cicd-lab',
  standalone: true,
  imports: [LabBreadcrumb, ScenarioCard, TechnologyBrief],
  templateUrl: './cicd-lab.html',
  styleUrl: './cicd-lab.scss',
})
export class CicdLab {}
