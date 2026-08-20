// src/app/core/services/auth.service.ts
import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { API_BASE } from './api-base';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../shared/models/auth.model';

const STORAGE_KEY = 'ticketforge_token';

interface DecodedToken {
  sub: string; // email — this backend's JWT carries no role claim
  iat: number;
  exp: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(this.readStoredToken());

  readonly isLoggedIn = computed(() => this._token() !== null);

  readonly email = computed(() => {
    const token = this._token();
    if (!token) return null;
    try {
      return jwtDecode<DecodedToken>(token).sub;
    } catch {
      return null;
    }
  });

  constructor(private http: HttpClient) {}

  login(payload: LoginRequest) {
    return this.http.post<AuthResponse>(`${API_BASE}/auth/login`, payload).pipe(
      // tap-free: keep this service dependency-light, set token in subscribe
    );
  }

  register(payload: RegisterRequest) {
    return this.http.post<void>(`${API_BASE}/auth/register`, payload);
  }

  setToken(token: string) {
    localStorage.setItem(STORAGE_KEY, token);
    this._token.set(token);
  }

  logout() {
    localStorage.removeItem(STORAGE_KEY);
    this._token.set(null);
  }

  getToken(): string | null {
    return this._token();
  }

  private readStoredToken(): string | null {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // exp is seconds since epoch; Date.now() is ms
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return token;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
