import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    template: `
    <div class="auth-page">
      <div class="auth-card" style="max-width:560px">
        <div class="text-center mb-4">
          <div class="brand-logo">🏦</div>
          <h2 class="brand-title">CTS-BANK</h2>
          <p class="brand-sub">Create Your Account</p>
        </div>
        <form (ngSubmit)="onRegister()" #f="ngForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="data.name" name="name" required #nameF="ngModel" placeholder="John Doe">
              <div *ngIf="nameF.invalid && nameF.touched" class="invalid-feedback-custom">Name is required</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Role</label>
              <select class="form-select" [(ngModel)]="data.role" name="role" required>
                <option value="">Select Role</option>
                <option value="CUSTOMER">Customer</option>
                <option value="OFFICER">Officer</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="data.email" name="email" required email #emailF="ngModel" placeholder="john@example.com">
              <div *ngIf="emailF.invalid && emailF.touched" class="invalid-feedback-custom">Valid email is required</div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Phone Number</label>
              <input type="text" class="form-control" [(ngModel)]="data.phone" name="phone" required minlength="10" maxlength="10" #phoneF="ngModel" placeholder="10-digit number">
              <div *ngIf="phoneF.invalid && phoneF.touched" class="invalid-feedback-custom">Must be exactly 10 digits</div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" class="form-control" [(ngModel)]="data.password" name="password" required minlength="8" #pwdF="ngModel" placeholder="Minimum 8 characters">
            <div *ngIf="pwdF.invalid && pwdF.touched" class="invalid-feedback-custom">Password must be at least 8 characters</div>
            <div class="pwd-strength mt-1">
              <div class="pwd-bar" [style.width]="pwdStrength+'%'" [style.background]="pwdStrength>70?'var(--success)':pwdStrength>40?'var(--warning)':'var(--danger)'"></div>
            </div>
          </div>
          <button type="submit" class="btn-accent w-100 mt-2" [disabled]="loading || f.invalid">
            {{loading ? 'Creating Account...' : 'Register'}}
          </button>
        </form>
        <p class="text-center mt-3" style="color:var(--text-muted);font-size:0.85rem">
          Already have an account? <a routerLink="/login" style="color:var(--accent)">Login</a>
        </p>
      </div>
    </div>
  `,
    styles: [`
    .brand-logo { font-size: 3rem; margin-bottom: 8px; }
    .brand-title { color: var(--accent); font-weight: 800; font-size: 1.8rem; letter-spacing: 2px; margin: 0; }
    .brand-sub { color: var(--text-muted); font-size: 0.85rem; margin-top: 4px; }
    .pwd-strength { height: 4px; background: var(--surface); border-radius: 2px; overflow: hidden; }
    .pwd-bar { height: 100%; border-radius: 2px; transition: all 0.3s; }
  `]
})
export class RegisterComponent {
    data = { name: '', role: '', email: '', phone: '', password: '' };
    loading = false;

    constructor(private auth: AuthService, private router: Router, private toast: ToastService) { }

    get pwdStrength(): number {
        const p = this.data.password;
        let s = 0;
        if (p.length >= 8) s += 30;
        if (/[A-Z]/.test(p)) s += 20;
        if (/[0-9]/.test(p)) s += 25;
        if (/[^A-Za-z0-9]/.test(p)) s += 25;
        return s;
    }

    onRegister() {
        this.loading = true;
        this.auth.register(this.data).subscribe({
            next: () => { this.toast.success('Registration successful! Please login.'); this.router.navigate(['/login']); },
            error: (err) => { this.loading = false; this.toast.error(err.error?.message || 'Registration failed'); }
        });
    }
}
