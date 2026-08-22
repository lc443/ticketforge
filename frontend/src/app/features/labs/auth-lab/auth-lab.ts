// src/app/features/labs/auth-lab/auth-lab.ts

import { Component, computed, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScenarioCard } from '../../../shared/components/scenario-card/scenario-card';
import { LabBreadcrumb } from '../../../shared/components/lab-breadcrumb/lab-breadcrumb';
import { TechnologyBrief } from '../../../shared/components/technology-brief/technology-brief';

type Role = 'CUSTOMER' | 'ADMIN';

@Component({
  selector: 'app-auth-lab',
  standalone: true,
  imports: [ScenarioCard, LabBreadcrumb, TechnologyBrief, JsonPipe, RouterLink],
  templateUrl: './auth-lab.html',
  styleUrl: './auth-lab.scss',
})
export class AuthLab {
  loggedIn = signal(false);
  role = signal<Role>('CUSTOMER');
  tampered = signal(false);

  actionResult = signal<{ ok: boolean; message: string } | null>(null);

  header = { alg: 'HS256', typ: 'JWT' };

  payload = computed(() => ({
    sub: 'jane@ticketforge.dev',
    role: this.tampered() ? 'ADMIN' : this.role(),
    exp: '1h',
  }));

  // What TicketForge's real token looks like today — no role claim.
  realPayload = { sub: 'jane@ticketforge.dev', iat: 1734000000, exp: 1734086400 };

  signatureValid = computed(() => !this.tampered());

  quiz = [
    {
      question: 'What does authentication answer? What does authorization answer?',
      options: [
        'Authentication = who you are. Authorization = what you can do.',
        'They mean the same thing',
        'Authentication = what you can do. Authorization = who you are.',
      ],
      correct: 0,
    },
    {
      question: 'You edit a JWT payload to say role: ADMIN. Why does the server still reject it?',
      options: [
        "It doesn't — clients can set their own role",
        "The signature was computed over the original payload; editing the payload without the server's secret makes the signature invalid",
        'JWTs cannot be decoded by anyone but the server',
      ],
      correct: 1,
    },
    {
      question: 'Why does a stateless JWT help Sprint 4 (horizontal scaling)?',
      options: [
        'It makes tokens smaller',
        'Any API instance can verify a token on its own — no shared session store needed',
        'JWTs automatically load-balance requests',
      ],
      correct: 1,
    },
    {
      question:
        "TicketForge's JwtAuthenticationFilter validated every token's signature correctly, yet every protected endpoint still returned 401. Why?",
      options: [
        'The filter validated the signature but never populated SecurityContextHolder — Spring Security had no Authentication to check, so anyRequest().authenticated() failed regardless',
        'The JWT secret was wrong',
        'CORS was blocking the request before it reached the filter',
      ],
      correct: 0,
    },
    {
      question: 'What is the difference between "validating" a token and "authenticating" a request?',
      options: [
        'They are the same operation',
        'Validating proves the token is genuine (signature/expiry); authenticating means telling the security framework who this request is, so downstream authorization checks pass',
        'Authenticating happens before validating',
      ],
      correct: 1,
    },
  ];
  quizAnswers = signal<Record<number, number | null>>({});

  login(role: Role) {
    this.loggedIn.set(true);
    this.role.set(role);
    this.tampered.set(false);
    this.actionResult.set(null);
  }

  logout() {
    this.loggedIn.set(false);
    this.tampered.set(false);
    this.actionResult.set(null);
  }

  tamperToken() {
    if (!this.loggedIn() || this.role() === 'ADMIN') return;
    this.tampered.set(true);
    this.actionResult.set(null);
  }

  tryAdminAction() {
    if (!this.loggedIn()) return;

    if (this.tampered()) {
      this.actionResult.set({
        ok: false,
        message: '401 Unauthorized — signature does not match the payload. Token rejected before role is even checked.',
      });
      return;
    }

    if (this.role() === 'ADMIN') {
      this.actionResult.set({ ok: true, message: '200 OK — signature valid, role ADMIN. Event created.' });
    } else {
      this.actionResult.set({
        ok: false,
        message: '403 Forbidden — signature valid, identity confirmed, but role CUSTOMER is not allowed to create events.',
      });
    }
  }

  answerQuiz(i: number, index: number) {
    if (this.quizAnswers()[i] != null) return;
    this.quizAnswers.update((a) => ({ ...a, [i]: index }));
  }

  wasAnswered(i: number) {
    return this.quizAnswers()[i] != null;
  }

  selected(i: number) {
    return this.quizAnswers()[i] ?? null;
  }
}
