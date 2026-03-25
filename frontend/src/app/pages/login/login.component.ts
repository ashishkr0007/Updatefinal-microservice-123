import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="text-center mb-4">
          <div class="brand-logo">🏦</div>
          <h2 class="brand-title">CTS-BANK</h2>
          <p class="brand-sub">Secure Banking Solutions</p>
        </div>
        <form (ngSubmit)="onLogin()" #f="ngForm">
          <div class="mb-3">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="email" name="email" required email #emailF="ngModel" placeholder="Enter your email">
            <div *ngIf="emailF.invalid && emailF.touched" class="invalid-feedback-custom">Please enter a valid email</div>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <div class="position-relative">
              <input [type]="showPwd ? 'text' : 'password'" class="form-control" [(ngModel)]="password" name="password" required minlength="8" #pwdF="ngModel" placeholder="Enter your password">
              <span class="pwd-toggle" (click)="showPwd=!showPwd">{{showPwd ? '🙈' : '👁️'}}</span>
            </div>
            <div *ngIf="pwdF.invalid && pwdF.touched" class="invalid-feedback-custom">Password must be at least 8 characters</div>
          </div>
          <button type="submit" class="btn-accent w-100 mt-2" [disabled]="loading || f.invalid">
            {{loading ? 'Logging in...' : 'Login'}}
          </button>
        </form>
        <p class="text-center mt-3" style="color:var(--text-muted);font-size:0.85rem">
          Don't have an account? <a routerLink="/register" style="color:var(--accent)">Register</a>
        </p>
        <p class="text-center mt-2" style="color:var(--text-muted);font-size:0.7rem">🔒 Protected by BCrypt Encryption</p>
      </div>
    </div>
  `,
    styles: [`
    .brand-logo { font-size: 3rem; margin-bottom: 8px; }
    .brand-title { color: var(--accent); font-weight: 800; font-size: 1.8rem; letter-spacing: 2px; margin: 0; }
    .brand-sub { color: var(--text-muted); font-size: 0.85rem; margin-top: 4px; }
    .pwd-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 1.1rem; }
  `]
})
export class LoginComponent {
    email = ''; password = ''; showPwd = false; loading = false;

    constructor(private auth: AuthService, private router: Router, private toast: ToastService) { }

    onLogin() {
        this.loading = true;
        this.auth.login({ email: this.email, password: this.password }).subscribe({
            next: () => {
                this.auth.fetchProfile().subscribe({
                    next: () => { this.toast.success('Login successful!'); this.router.navigate(['/dashboard']); },
                    error: () => { this.loading = false; this.toast.error('Failed to load profile'); }
                });
            },
            error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Invalid email or password'); }
        });
    }
}
