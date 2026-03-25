import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/api.service';
import { ToastService } from '../../core/toast.service';
import { FinancialReportResponse } from '../../models/models';

@Component({
    selector: 'app-analytics',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <h1 class="section-title">Financial Analytics</h1>
    <p class="section-subtitle">Admin & Officer access only</p>

    <!-- Generate Report -->
    <div class="glass-card mb-4">
      <h3 style="font-size:1rem;font-weight:600;color:var(--accent);margin-bottom:16px">Generate Compliance Report</h3>
      <form (ngSubmit)="generateReport()" class="d-flex gap-3 align-items-end flex-wrap">
        <div>
          <label class="form-label">From</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="reportReq.from" name="from" required>
        </div>
        <div>
          <label class="form-label">To</label>
          <input type="datetime-local" class="form-control" [(ngModel)]="reportReq.to" name="to" required>
        </div>
        <div>
          <label class="form-label">Fraud Threshold (₹)</label>
          <input type="number" class="form-control" [(ngModel)]="reportReq.fraudAmountThreshold" name="threshold" placeholder="Optional">
        </div>
        <button type="submit" class="btn-accent" [disabled]="generating">
          {{generating ? 'Generating...' : 'Generate Report'}}
        </button>
      </form>
    </div>

    <!-- Trends -->
    <div class="glass-card mb-4">
      <h3 style="font-size:1rem;font-weight:600;color:var(--accent);margin-bottom:16px">Transaction Trends</h3>
      <form (ngSubmit)="loadTrends()" class="d-flex gap-3 align-items-end flex-wrap mb-3">
        <div>
          <label class="form-label">From Date</label>
          <input type="date" class="form-control" [(ngModel)]="trendFrom" name="trendFrom" required>
        </div>
        <div>
          <label class="form-label">To Date</label>
          <input type="date" class="form-control" [(ngModel)]="trendTo" name="trendTo" required>
        </div>
        <button type="submit" class="btn-outline-accent">Load Trends</button>
      </form>
      <div *ngIf="trends.length > 0">
        <table class="table-dark-custom">
          <thead><tr><th>Date</th><th>Transactions</th><th>Total Amount</th></tr></thead>
          <tbody>
            <tr *ngFor="let t of trends">
              <td>{{t.date}}</td>
              <td>{{t.transactionCount}}</td>
              <td>₹{{t.totalAmount?.toFixed(2) || '0.00'}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div *ngIf="trends.length === 0 && trendsLoaded" style="color:var(--text-muted);padding:16px;text-align:center">No trend data found for this period</div>
    </div>

    <!-- Reports List -->
    <div class="glass-card">
      <h3 style="font-size:1rem;font-weight:600;color:var(--accent);margin-bottom:16px">All Reports</h3>
      <div *ngIf="reports.length === 0" style="color:var(--text-muted);padding:16px;text-align:center">No reports generated yet</div>
      <table *ngIf="reports.length > 0" class="table-dark-custom">
        <thead>
          <tr><th>ID</th><th>Period</th><th>Transactions</th><th>Amount</th><th>Fraud Alerts</th><th>Generated</th></tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of reports">
            <td>#{{r.reportId}}</td>
            <td>{{r.period}}</td>
            <td>{{r.totalTransactions}}</td>
            <td>₹{{r.totalAmount?.toFixed(2) || '0.00'}}</td>
            <td><span [class]="r.fraudAlerts > 0 ? 'badge-danger' : 'badge-success'">{{r.fraudAlerts}}</span></td>
            <td>{{r.generatedAt}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class AnalyticsComponent implements OnInit {
    reports: FinancialReportResponse[] = [];
    trends: any[] = [];
    trendsLoaded = false;
    generating = false;
    reportReq = { from: '', to: '', fraudAmountThreshold: undefined as number | undefined };
    trendFrom = ''; trendTo = '';

    constructor(private api: ApiService, private toast: ToastService) { }

    ngOnInit() {
        this.api.getReports().subscribe({
            next: r => this.reports = r,
            error: e => this.toast.error(e.error?.message || 'Failed to load reports')
        });
    }

    generateReport() {
        this.generating = true;
        this.api.generateComplianceReport(this.reportReq as any).subscribe({
            next: r => { this.reports.unshift(r); this.toast.success('Report generated!'); this.generating = false; },
            error: e => { this.toast.error(e.error?.message || 'Failed to generate report'); this.generating = false; }
        });
    }

    loadTrends() {
        this.api.getTrends(this.trendFrom, this.trendTo).subscribe({
            next: t => { this.trends = t; this.trendsLoaded = true; },
            error: e => this.toast.error(e.error?.message || 'Failed to load trends')
        });
    }
}
