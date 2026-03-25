import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="brand-icon">🏦</span>
        <span class="brand-text">CTS-BANK</span>
      </div>
      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📊</span> Dashboard
        </a>
        <a routerLink="/account" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">💳</span> My Account
        </a>
        <a routerLink="/transactions" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">💸</span> Transactions
        </a>
        <a routerLink="/notifications" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">🔔</span> Notifications
        </a>
        <a routerLink="/profile" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">👤</span> Profile Settings
        </a>
        <div *ngIf="auth.isAdmin" class="nav-divider">
          <span>Admin</span>
        </div>
        <a *ngIf="auth.isAdmin" routerLink="/user-management" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">👥</span> User Management
        </a>
        <a *ngIf="auth.isAdmin" routerLink="/account-management" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">🏛️</span> Account Management
        </a>
        <div *ngIf="auth.canViewAnalytics" class="nav-divider">
          <span>Reports</span>
        </div>
        <a *ngIf="auth.canViewAnalytics" routerLink="/analytics" routerLinkActive="active" class="nav-item">
          <span class="nav-icon">📈</span> Analytics Reports
        </a>
      </nav>
    </aside>
  `,
    styles: [`
    .sidebar {
      position: fixed; top: 0; left: 0; width: var(--sidebar-width); height: 100vh;
      background: linear-gradient(180deg, #0d1b2e 0%, #091422 100%);
      border-right: 1px solid rgba(212,168,67,0.08); z-index: 100;
      display: flex; flex-direction: column; overflow-y: auto;
    }
    .sidebar-brand {
      padding: 22px 24px; display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(212,168,67,0.1);
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-text { font-size: 1.3rem; font-weight: 800; color: var(--accent); letter-spacing: 1px; }
    .sidebar-nav { padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .nav-item {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      color: var(--text-muted); text-decoration: none; border-radius: 10px;
      font-size: 0.9rem; font-weight: 500; transition: all 0.2s ease;
    }
    .nav-item:hover { background: rgba(212,168,67,0.06); color: var(--text); }
    .nav-item.active { background: rgba(212,168,67,0.1); color: var(--accent); font-weight: 600; }
    .nav-icon { font-size: 1.1rem; width: 24px; text-align: center; }
    .nav-divider {
      padding: 16px 16px 6px; font-size: 0.7rem; color: var(--text-muted);
      text-transform: uppercase; letter-spacing: 1px; font-weight: 600;
    }
  `]
})
export class SidebarComponent {
    constructor(public auth: AuthService) { }
}
