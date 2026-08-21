import { DOCUMENT } from '@angular/common';
import { computed, inject, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ticketforge.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly selectedTheme = signal<Theme>(this.initialTheme());

  readonly theme = this.selectedTheme.asReadonly();
  readonly isDark = computed(() => this.selectedTheme() === 'dark');

  constructor() {
    this.apply(this.selectedTheme());
  }

  toggle(): void {
    const nextTheme: Theme = this.isDark() ? 'light' : 'dark';
    this.selectedTheme.set(nextTheme);
    this.apply(nextTheme);

    try {
      localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme still works when browser storage is unavailable.
    }
  }

  private initialTheme(): Theme {
    try {
      const storedTheme = localStorage.getItem(STORAGE_KEY);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
    } catch {
      // Fall through to the operating-system preference.
    }

    return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(theme: Theme): void {
    this.document.documentElement.dataset['theme'] = theme;
    this.document.documentElement.style.colorScheme = theme;
  }
}
