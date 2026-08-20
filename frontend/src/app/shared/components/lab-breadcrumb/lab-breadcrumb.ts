// src/app/shared/components/lab-breadcrumb/lab-breadcrumb.ts

import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LAB_NAV } from '../../data/lab-nav';

@Component({
  selector: 'app-lab-breadcrumb',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './lab-breadcrumb.html',
  styleUrl: './lab-breadcrumb.scss',
})
export class LabBreadcrumb {
  path = input.required<string>();

  private index = computed(() => LAB_NAV.findIndex((l) => l.path === this.path()));

  current = computed(() => LAB_NAV[this.index()] ?? null);
  prev = computed(() => (this.index() > 0 ? LAB_NAV[this.index() - 1] : null));
  next = computed(() =>
    this.index() >= 0 && this.index() < LAB_NAV.length - 1 ? LAB_NAV[this.index() + 1] : null,
  );
}
