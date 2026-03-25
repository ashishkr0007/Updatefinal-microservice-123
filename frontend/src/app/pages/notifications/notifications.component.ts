import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { ToastService } from '../../core/toast.service';
import { NotificationResponse } from '../../models/models';

@Component({
    selector: 'app-notifications',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1 class="section-title">Notifications</h1>
    <p class="section-subtitle">Your alerts and updates</p>
    <div class="glass-card">
      <div *ngIf="notifications.length === 0" class="text-center" style="padding:40px;color:var(--text-muted)">
        No notifications yet
      </div>
      <div *ngFor="let n of notifications" class="notification-item" [class.unread]="!n.read">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <div style="font-size:0.9rem;color:var(--text)">{{n.message}}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px">{{n.createdAt | date:'medium'}}</div>
          </div>
          <button *ngIf="!n.read" class="btn-outline-accent" style="padding:4px 12px;font-size:0.75rem" (click)="markRead(n)">
            Mark Read
          </button>
          <span *ngIf="n.read" class="badge-success" style="font-size:0.7rem">Read</span>
        </div>
      </div>
    </div>
  `
})
export class NotificationsComponent implements OnInit {
    notifications: NotificationResponse[] = [];

    constructor(private api: ApiService, private auth: AuthService, private toast: ToastService) { }

    ngOnInit() {
        if (this.auth.userId) {
            this.api.getNotifications(this.auth.userId).subscribe({
                next: n => this.notifications = n,
                error: () => this.toast.error('Failed to load notifications')
            });
        }
    }

    markRead(n: NotificationResponse) {
        this.api.markRead(n.notificationId).subscribe({
            next: updated => {
                const idx = this.notifications.findIndex(x => x.notificationId === n.notificationId);
                if (idx >= 0) this.notifications[idx] = updated;
                this.toast.success('Marked as read');
            },
            error: () => this.toast.error('Failed to mark as read')
        });
    }
}
