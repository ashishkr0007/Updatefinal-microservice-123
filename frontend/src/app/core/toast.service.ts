import { Injectable } from '@angular/core';

export interface Toast { message: string; type: 'success' | 'error' | 'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
    toasts: Toast[] = [];

    show(message: string, type: 'success' | 'error' | 'info' = 'info') {
        const toast = { message, type };
        this.toasts.push(toast);
        setTimeout(() => this.toasts = this.toasts.filter(t => t !== toast), 4000);
    }

    success(msg: string) { this.show(msg, 'success'); }
    error(msg: string) { this.show(msg, 'error'); }
    info(msg: string) { this.show(msg, 'info'); }
}
