import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../core/toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast-container">
      <div *ngFor="let t of toast.toasts" class="toast-msg" [ngClass]="'toast-'+t.type">
        <span *ngIf="t.type==='success'">✅</span>
        <span *ngIf="t.type==='error'">❌</span>
        <span *ngIf="t.type==='info'">ℹ️</span>
        {{t.message}}
      </div>
    </div>
  `
})
export class ToastComponent {
    constructor(public toast: ToastService) { }
}
