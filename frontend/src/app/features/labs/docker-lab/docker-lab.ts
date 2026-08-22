import { Component, computed, signal } from '@angular/core';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

type ChangeKind = 'source' | 'dependencies' | 'nginx';

@Component({
  selector: 'app-docker-lab',
  standalone: true,
  imports: [LabBreadcrumb, ScenarioCard, TechnologyBrief],
  templateUrl: './docker-lab.html',
  styleUrl: './docker-lab.scss',
})
export class DockerLab {
  change = signal<ChangeKind>('source');

  layers = computed(() => {
    const selected = this.change();
    return [
      { name: 'Base runtime', detail: 'JRE 21 or Nginx', rebuilt: false },
      {
        name: 'Dependencies',
        detail: 'Maven or npm packages',
        rebuilt: selected === 'dependencies',
      },
      {
        name: 'Application build',
        detail: 'Compile source and produce the artifact',
        rebuilt: selected !== 'nginx',
      },
      {
        name: 'Runtime configuration',
        detail: 'Copy the JAR, static files, or Nginx config',
        rebuilt: true,
      },
    ];
  });

  select(change: ChangeKind) {
    this.change.set(change);
  }
}
