import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { ApiService } from '../../core/api.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <nav class="navbar-custom">
      <div class="navbar-left">
        <span class="page-greeting">Welcome back, <strong>{{auth.currentUser?.name || 'User'}}</strong></span>
      </div>
      <div class="navbar-right">
        <div class="notif-bell" routerLink="/notifications">
          🔔
          <span *ngIf="unreadCount > 0" class="notif-badge">{{unreadCount}}</span>
        </div>
        <div class="user-menu" (click)="menuOpen = !menuOpen">
          <div class="user-avatar">{{getInitials()}}</div>
          <div class="user-info">
            <span class="user-name">{{auth.currentUser?.name}}</span>
            <span class="user-role">{{auth.currentUser?.role}}</span>
          </div>
          <span class="dropdown-arrow">▾</span>
        </div>
        <div *ngIf="menuOpen" class="dropdown-menu-custom">
          <a routerLink="/profile" (click)="menuOpen=false">👤 Profile Settings</a>
          <a (click)="logout()">🚪 Logout</a>
        </div>
      </div>
    </nav>
  `,
    styles: [`
    .navbar-custom {
      position: fixed; top: 0; left: var(--sidebar-width); right: 0; height: var(--navbar-height);
      background: rgba(10,22,40,0.85); backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(212,168,67,0.08); display: flex;
      align-items: center; justify-content: space-between; padding: 0 30px; z-index: 99;
    }
    .page-greeting { color: var(--text-muted); font-size: 0.9rem; }
    .page-greeting strong { color: var(--text); }
    .navbar-right { display: flex; align-items: center; gap: 20px; position: relative; }
    .notif-bell {
      font-size: 1.2rem; cursor: pointer; position: relative; padding: 8px;
      border-radius: 8px; transition: all 0.2s;
    }
    .notif-bell:hover { background: rgba(212,168,67,0.08); }
    .notif-badge {
      position: absolute; top: 2px; right: 2px; background: var(--danger); color: white;
      font-size: 0.65rem; width: 18px; height: 18px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; font-weight: 700;
    }
    .user-menu {
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      padding: 6px 12px; border-radius: 10px; transition: all 0.2s;
    }
    .user-menu:hover { background: rgba(212,168,67,0.06); }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 10px;
      background: linear-gradient(135deg, var(--accent), var(--accent-dark));
      display: flex; align-items: center; justify-content: center;
      color: var(--primary); font-weight: 700; font-size: 0.85rem;
    }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.85rem; font-weight: 600; color: var(--text); }
    .user-role { font-size: 0.7rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.5px; }
    .dropdown-arrow { color: var(--text-muted); font-size: 0.8rem; }
    .dropdown-menu-custom {
      position: absolute; top: 52px; right: 0; background: var(--surface);
      border: 1px solid rgba(212,168,67,0.12); border-radius: 10px;
      min-width: 180px; box-shadow: 0 8px 30px rgba(0,0,0,0.4); overflow: hidden;
    }
    .dropdown-menu-custom a {
      display: block; padding: 12px 16px; color: var(--text-muted);
      text-decoration: none; font-size: 0.85rem; transition: all 0.2s; cursor: pointer;
    }
    .dropdown-menu-custom a:hover { background: rgba(212,168,67,0.06); color: var(--text); }
  `]
})
export class NavbarComponent implements OnInit {
    unreadCount = 0;
    menuOpen = false;

    constructor(public auth: AuthService, private api: ApiService) { }

    ngOnInit() {
        if (this.auth.userId) {
            this.api.getUnreadCount(this.auth.userId).subscribe(c => this.unreadCount = c);
        }
    }

    getInitials(): string {
        const n = this.auth.currentUser?.name || '';
        return n.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
    }

    logout() { this.menuOpen = false; this.auth.logout(); }
}
