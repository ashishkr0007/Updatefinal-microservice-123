import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { UserResponse } from '../../models/models';

@Component({
    selector: 'app-user-management',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1 class="section-title">User Management</h1>
    <p class="section-subtitle">Admin only — View all registered users</p>
    <div class="glass-card">
      <div *ngIf="users.length === 0" style="color:var(--text-muted);padding:16px;text-align:center">No users found</div>
      <table *ngIf="users.length > 0" class="table-dark-custom">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of users">
            <td>#{{u.userId}}</td>
            <td>{{u.name}}</td>
            <td>{{u.email}}</td>
            <td>{{u.phone}}</td>
            <td>
              <span [ngClass]="{
                'badge-info': u.role==='CUSTOMER',
                'badge-warning': u.role==='OFFICER',
                'badge-danger': u.role==='ADMIN'
              }">{{u.role}}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
    users: UserResponse[] = [];

    constructor(private api: ApiService, private toast: ToastService) { }

    ngOnInit() {
        this.api.getAllUsers().subscribe({
            next: u => this.users = u,
            error: e => this.toast.error(e.error?.message || 'You are not authorized to do this')
        });
    }
}
