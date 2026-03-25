import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';

@Component({
    selector: 'app-transactions',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h1 class="section-title">Transactions</h1>
    <p class="section-subtitle">Deposit, withdraw, or transfer funds</p>

    <ul class="nav nav-tabs-custom d-flex mb-4">
      <li><a class="nav-link" [class.active]="activeTab==='deposit'" (click)="activeTab='deposit'">💰 Deposit</a></li>
      <li><a class="nav-link" [class.active]="activeTab==='withdraw'" (click)="activeTab='withdraw'">🏧 Withdraw</a></li>
      <li><a class="nav-link" [class.active]="activeTab==='transfer'" (click)="activeTab='transfer'">🔄 Transfer</a></li>
    </ul>

    <div class="glass-card" style="max-width:500px">
      <!-- Deposit -->
      <form *ngIf="activeTab==='deposit'" (ngSubmit)="doDeposit()" #df="ngForm">
        <div class="mb-3">
          <label class="form-label">Account ID</label>
          <input type="number" class="form-control" [(ngModel)]="depositData.accountId" name="accountId" required placeholder="Enter account ID">
        </div>
        <div class="mb-3">
          <label class="form-label">Amount (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="depositData.amount" name="amount" required min="1" placeholder="Enter amount">
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="loading || df.invalid">
          {{loading ? 'Processing...' : 'Deposit'}}
        </button>
      </form>

      <!-- Withdraw -->
      <form *ngIf="activeTab==='withdraw'" (ngSubmit)="doWithdraw()" #wf="ngForm">
        <div class="mb-3">
          <label class="form-label">Account ID</label>
          <input type="number" class="form-control" [(ngModel)]="withdrawData.accountId" name="accountId" required placeholder="Enter account ID">
        </div>
        <div class="mb-3">
          <label class="form-label">Amount (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="withdrawData.amount" name="amount" required min="1" placeholder="Enter amount">
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="loading || wf.invalid">
          {{loading ? 'Processing...' : 'Withdraw'}}
        </button>
      </form>

      <!-- Transfer -->
      <form *ngIf="activeTab==='transfer'" (ngSubmit)="doTransfer()" #tf="ngForm">
        <div class="mb-3">
          <label class="form-label">From Account ID</label>
          <input type="number" class="form-control" [(ngModel)]="transferData.accountId" name="accountId" required placeholder="Your account ID">
        </div>
        <div class="mb-3">
          <label class="form-label">To Account ID</label>
          <input type="number" class="form-control" [(ngModel)]="transferData.toAccountId" name="toAccountId" required placeholder="Recipient account ID">
        </div>
        <div class="mb-3">
          <label class="form-label">Amount (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="transferData.amount" name="amount" required min="1" placeholder="Enter amount">
        </div>
        <button type="submit" class="btn-accent w-100" [disabled]="loading || tf.invalid">
          {{loading ? 'Processing...' : 'Transfer'}}
        </button>
      </form>

      <!-- Result -->
      <div *ngIf="result" class="mt-3 p-3" style="background:rgba(34,197,94,0.08);border-radius:10px;border:1px solid rgba(34,197,94,0.2)">
        <div style="color:var(--success);font-weight:600;margin-bottom:4px">✅ {{result.message}}</div>
        <div style="color:var(--text-muted);font-size:0.85rem">Account #{{result.accountId}} — Updated Balance: ₹{{result.updatedBalance.toFixed(2)}}</div>
      </div>
    </div>
  `
})
export class TransactionsComponent implements OnInit {
    activeTab = 'deposit';
    loading = false;
    depositData = { accountId: 0, amount: 0 };
    withdrawData = { accountId: 0, amount: 0 };
    transferData = { accountId: 0, toAccountId: 0, amount: 0 };
    result: any = null;

    constructor(private api: ApiService, private toast: ToastService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.route.queryParams.subscribe(p => { if (p['tab']) this.activeTab = p['tab']; });
    }

    doDeposit() {
        this.loading = true; this.result = null;
        this.api.deposit(this.depositData).subscribe({
            next: r => { this.result = r; this.toast.success('Deposit successful!'); this.loading = false; },
            error: e => { this.toast.error(e.error?.message || 'Deposit failed'); this.loading = false; }
        });
    }

    doWithdraw() {
        this.loading = true; this.result = null;
        this.api.withdraw(this.withdrawData).subscribe({
            next: r => { this.result = r; this.toast.success('Withdrawal successful!'); this.loading = false; },
            error: e => { this.toast.error(e.error?.message || 'Withdrawal failed'); this.loading = false; }
        });
    }

    doTransfer() {
        this.loading = true; this.result = null;
        this.api.transfer(this.transferData).subscribe({
            next: r => { this.result = r; this.toast.success('Transfer successful!'); this.loading = false; },
            error: e => { this.toast.error(e.error?.message || 'Transfer failed'); this.loading = false; }
        });
    }
}
