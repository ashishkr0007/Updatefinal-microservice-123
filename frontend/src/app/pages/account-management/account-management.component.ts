import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { Account } from '../../models/models';

@Component({
    selector: 'app-account-management',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h1 class="section-title">Account Management</h1>
    <p class="section-subtitle">Admin only — Create and manage bank accounts</p>

    <!-- Create Account -->
    <div class="glass-card mb-4" style="max-width:500px">
      <h3 style="font-size:1rem;font-weight:600;color:var(--accent);margin-bottom:16px">Create New Account</h3>
      <form (ngSubmit)="createAccount()" #cf="ngForm">
        <div class="mb-3">
          <label class="form-label">User ID</label>
          <input type="number" class="form-control" [(ngModel)]="newAccount.userID" name="userId" required placeholder="User ID">
        </div>
        <div class="mb-3">
          <label class="form-label">Account Type</label>
          <select class="form-select" [(ngModel)]="newAccount.accountType" name="type" required>
            <option value="">Select Type</option>
            <option value="SAVINGS">Savings</option>
            <option value="CURRENT">Current</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Initial Balance (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="newAccount.balance" name="balance" placeholder="0.00">
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="creating || cf.invalid">
          {{creating ? 'Creating...' : 'Create Account'}}
        </button>
      </form>
    </div>

    <!-- All Accounts -->
    <div class="glass-card">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 style="font-size:1rem;font-weight:600;color:var(--accent);margin:0">All Accounts</h3>
        <button class="btn-outline-accent" style="padding:6px 16px;font-size:0.8rem" (click)="loadAccounts()">Refresh</button>
      </div>
      <table *ngIf="accounts.length > 0" class="table-dark-custom">
        <thead>
          <tr><th>ID</th><th>User ID</th><th>Type</th><th>Balance</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let a of accounts">
            <td>#{{a.accountID}}</td>
            <td>#{{a.userID}}</td>
            <td>{{a.accountType}}</td>
            <td>₹{{a.balance.toFixed(2)}}</td>
            <td>
              <span [class]="a.status==='Active' ? 'badge-success' : 'badge-danger'">{{a.status}}</span>
            </td>
            <td>
              <button *ngIf="a.status==='Active'" class="btn-outline-accent" style="padding:4px 10px;font-size:0.75rem" (click)="updateStatus(a.accountID, 'Closed')">Close</button>
              <button *ngIf="a.status!=='Active'" class="btn-outline-accent" style="padding:4px 10px;font-size:0.75rem" (click)="updateStatus(a.accountID, 'Active')">Activate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AccountManagementComponent implements OnInit {
    accounts: Account[] = [];
    newAccount: Partial<Account> = {};
    creating = false;

    constructor(private api: ApiService, private toast: ToastService) { }

    ngOnInit() { this.loadAccounts(); }

    loadAccounts() {
        this.api.getAllAccounts().subscribe({
            next: a => this.accounts = a,
            error: e => this.toast.error(e.error?.message || 'Access denied')
        });
    }

    createAccount() {
        this.creating = true;
        this.api.createAccount(this.newAccount).subscribe({
            next: a => { this.accounts.unshift(a); this.newAccount = {}; this.toast.success('Account created!'); this.creating = false; },
            error: e => { this.toast.error(e.error?.message || 'Failed to create account'); this.creating = false; }
        });
    }

    updateStatus(id: number, status: string) {
        this.api.updateAccountStatus(id, status).subscribe({
            next: updated => {
                const idx = this.accounts.findIndex(a => a.accountID === id);
                if (idx >= 0) this.accounts[idx] = updated;
                this.toast.success('Account status updated!');
            },
            error: e => this.toast.error(e.error?.message || 'Failed to update status')
        });
    }
}
