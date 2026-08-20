import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error.set(null);
    this.loading.set(true);

    this.auth
      .register({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
      })
      .subscribe({
        next: () => {
          // Register returns 201 with no body — log in right after to get a token.
          this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: (res) => {
              this.auth.setToken(res.token);
              this.loading.set(false);
              this.router.navigate(['/events']);
            },
            error: () => {
              this.loading.set(false);
              this.router.navigate(['/login']);
            },
          });
        },
        error: () => {
          this.loading.set(false);
          this.error.set('Registration failed. Email may already be in use.');
        },
      });
  }
}
