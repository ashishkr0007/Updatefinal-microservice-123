import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { UpdateUserRequest } from '../../models/models';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h1 class="section-title">Profile Settings</h1>
    <p class="section-subtitle">Update your personal information</p>
    <div class="glass-card" style="max-width:560px">
      <form (ngSubmit)="onUpdate()" #f="ngForm">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Full Name</label>
            <input type="text" class="form-control" [(ngModel)]="data.name" name="name" [placeholder]="auth.currentUser?.name || ''">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Email Address</label>
            <input type="email" class="form-control" [(ngModel)]="data.email" name="email" [placeholder]="auth.currentUser?.email || ''">
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Phone Number</label>
            <input type="text" class="form-control" [(ngModel)]="data.phone" name="phone" minlength="10" maxlength="10" [placeholder]="auth.currentUser?.phone || ''">
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">New Password</label>
            <input type="password" class="form-control" [(ngModel)]="data.password" name="password" minlength="8" placeholder="Leave blank to keep current">
          </div>
        </div>
        <div class="mb-3 p-3" style="background:var(--surface);border-radius:10px">
          <div style="font-size:0.8rem;color:var(--text-muted)">Role (cannot be changed)</div>
          <div style="font-size:1rem;font-weight:600;color:var(--accent)">{{auth.currentUser?.role}}</div>
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="loading">
          {{loading ? 'Updating...' : 'Update Profile'}}
        </button>
      </form>
    </div>
  `
})
export class ProfileComponent implements OnInit {
    data: UpdateUserRequest = {};
    loading = false;

    constructor(public auth: AuthService, private toast: ToastService) { }

    ngOnInit() { }

    onUpdate() {
        const req: UpdateUserRequest = {};
        if (this.data.name?.trim()) req.name = this.data.name.trim();
        if (this.data.email?.trim()) req.email = this.data.email.trim();
        if (this.data.phone?.trim()) req.phone = this.data.phone.trim();
        if (this.data.password?.trim()) req.password = this.data.password.trim();

        if (Object.keys(req).length === 0) { this.toast.info('No changes to update'); return; }

        this.loading = true;
        this.auth.updateProfile(req).subscribe({
            next: () => { this.toast.success('Profile updated successfully!'); this.loading = false; this.data = {}; },
            error: e => { this.toast.error(e.error?.message || 'Update failed'); this.loading = false; }
        });
    }
}
