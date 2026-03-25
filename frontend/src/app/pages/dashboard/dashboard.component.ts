import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';
import { Account, NotificationResponse } from '../../models/models';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <h1 class="section-title">Dashboard</h1>
    <p class="section-subtitle">Overview of your banking activity</p>

    <!-- Stat Cards -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-label">Account Balance</div>
          <div class="stat-value">₹{{account?.balance?.toFixed(2) || '0.00'}}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-label">Account Type</div>
          <div class="stat-value" style="font-size:1.3rem">{{account?.accountType || 'N/A'}}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-label">Account Status</div>
          <div>
            <span [class]="account?.status==='Active' ? 'badge-success' : 'badge-danger'">{{account?.status || 'N/A'}}</span>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card">
          <div class="stat-label">Notifications</div>
          <div class="stat-value" style="font-size:1.3rem">{{notifications.length}}</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <h2 class="section-title" style="font-size:1.1rem">Quick Actions</h2>
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'deposit'}" class="quick-action text-decoration-none">
          <div class="icon" style="background:rgba(34,197,94,0.12);color:var(--success)">💰</div>
          <span>Deposit</span>
        </a>
      </div>
      <div class="col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'withdraw'}" class="quick-action text-decoration-none">
          <div class="icon" style="background:rgba(239,68,68,0.12);color:var(--danger)">🏧</div>
          <span>Withdraw</span>
        </a>
      </div>
      <div class="col-md-3">
        <a routerLink="/transactions" [queryParams]="{tab:'transfer'}" class="quick-action text-decoration-none">
          <div class="icon" style="background:rgba(59,130,246,0.12);color:var(--info)">🔄</div>
          <span>Transfer</span>
        </a>
      </div>
      <div class="col-md-3">
        <a routerLink="/notifications" class="quick-action text-decoration-none">
          <div class="icon" style="background:rgba(245,158,11,0.12);color:var(--warning)">🔔</div>
          <span>Notifications</span>
        </a>
      </div>
    </div>

    <!-- Recent Notifications -->
    <div class="glass-card">
      <h3 style="font-size:1rem;font-weight:600;margin-bottom:16px;color:var(--accent)">Recent Notifications</h3>
      <div *ngIf="notifications.length === 0" style="color:var(--text-muted);font-size:0.9rem;padding:12px 0">No notifications yet</div>
      <div *ngFor="let n of notifications.slice(0,5)" class="notification-item" [class.unread]="!n.read">
        <div style="font-size:0.9rem;color:var(--text)">{{n.message}}</div>
        <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">{{n.createdAt | date:'medium'}}</div>
      </div>
      <a *ngIf="notifications.length > 5" routerLink="/notifications" style="color:var(--accent);font-size:0.85rem;display:block;margin-top:12px;text-decoration:none">View all notifications →</a>
    </div>
  `
})
export class DashboardComponent implements OnInit {
    account: Account | null = null;
    notifications: NotificationResponse[] = [];

    constructor(public auth: AuthService, private api: ApiService) { }

    ngOnInit() {
        this.api.getMyAccounts().subscribe({
            next: accs => { if (accs.length > 0) this.account = accs[0]; },
            error: () => { }
        });
        if (this.auth.userId) {
            this.api.getNotifications(this.auth.userId).subscribe({
                next: n => this.notifications = n,
                error: () => { }
            });
        }
    }
}
