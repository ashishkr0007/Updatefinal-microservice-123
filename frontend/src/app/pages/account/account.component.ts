import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import { Account } from '../../models/models';

@Component({
    selector: 'app-account',
    standalone: true,
    imports: [CommonModule],
    template: `
    <h1 class="section-title">My Account</h1>
    <p class="section-subtitle">View your bank account details</p>

    <div *ngIf="!account" class="glass-card text-center" style="padding:40px">
      <p style="color:var(--text-muted);font-size:1rem">You don't have a bank account yet.</p>
      <p style="color:var(--text-muted);font-size:0.85rem">Please contact an administrator to create one.</p>
    </div>

    <div *ngIf="account" class="glass-card">
      <div class="row">
        <div class="col-md-6">
          <div class="detail-row">
            <span class="detail-label">Account ID</span>
            <span class="detail-value">#{{account.accountID}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Account Type</span>
            <span class="detail-value">{{account.accountType}}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span [class]="account.status==='Active' ? 'badge-success' : 'badge-danger'">{{account.status}}</span>
          </div>
        </div>
        <div class="col-md-6">
          <div class="detail-row">
            <span class="detail-label">User ID</span>
            <span class="detail-value">#{{account.userID}}</span>
          </div>
          <div class="balance-display">
            <span class="detail-label">Current Balance</span>
            <div class="balance-amount">₹{{account.balance.toFixed(2)}}</div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .detail-row { margin-bottom: 20px; }
    .detail-label { display: block; font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
    .detail-value { font-size: 1.1rem; font-weight: 600; color: var(--text); }
    .balance-display { margin-top: 10px; }
    .balance-amount { font-size: 2.2rem; font-weight: 800; color: var(--accent); }
  `]
})
export class AccountComponent implements OnInit {
    account: Account | null = null;

    constructor(private api: ApiService, private auth: AuthService) { }

    ngOnInit() {
        this.api.getMyAccounts().subscribe({
            next: accs => { if (accs.length > 0) this.account = accs[0]; },
            error: () => { }
        });
    }
}
