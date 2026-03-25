import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Account, TransactionRequest, TransactionResponse, UserResponse, NotificationResponse, FinancialReportRequest, FinancialReportResponse, TransactionTrendPoint, SendNotificationRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private readonly API = 'http://localhost:8090/api';

    constructor(private http: HttpClient) { }

    // ========== ACCOUNTS ==========
    getMyAccounts(): Observable<Account[]> { return this.http.get<Account[]>(`${this.API}/accounts/my`); }
    getAllAccounts(): Observable<Account[]> { return this.http.get<Account[]>(`${this.API}/accounts`); }
    getAccount(id: number): Observable<Account> { return this.http.get<Account>(`${this.API}/accounts/${id}`); }
    createAccount(account: Partial<Account>): Observable<Account> { return this.http.post<Account>(`${this.API}/accounts`, account); }
    updateAccountStatus(id: number, status: string): Observable<Account> { return this.http.put<Account>(`${this.API}/accounts/${id}/status?status=${status}`, {}); }
    getBalance(id: number): Observable<number> { return this.http.get<number>(`${this.API}/accounts/${id}/balance`); }

    // ========== TRANSACTIONS ==========
    deposit(req: TransactionRequest): Observable<TransactionResponse> { return this.http.post<TransactionResponse>(`${this.API}/transactions/deposit`, req); }
    withdraw(req: TransactionRequest): Observable<TransactionResponse> { return this.http.post<TransactionResponse>(`${this.API}/transactions/withdraw`, req); }
    transfer(req: TransactionRequest): Observable<TransactionResponse> { return this.http.post<TransactionResponse>(`${this.API}/transactions/transfer`, req); }

    // ========== USERS (ADMIN) ==========
    getAllUsers(): Observable<UserResponse[]> { return this.http.get<UserResponse[]>(`${this.API}/users`); }
    getUserById(id: number): Observable<UserResponse> { return this.http.get<UserResponse>(`${this.API}/users/${id}`); }

    // ========== NOTIFICATIONS ==========
    getNotifications(userId: number): Observable<NotificationResponse[]> { return this.http.get<NotificationResponse[]>(`${this.API}/notifications/user/${userId}`); }
    getUnreadCount(userId: number): Observable<number> { return this.http.get<number>(`${this.API}/notifications/user/${userId}/unread-count`); }
    markRead(id: number): Observable<NotificationResponse> { return this.http.put<NotificationResponse>(`${this.API}/notifications/${id}/read`, {}); }
    sendNotification(req: SendNotificationRequest): Observable<NotificationResponse> { return this.http.post<NotificationResponse>(`${this.API}/notifications/admin/send`, req); }

    // ========== ANALYTICS ==========
    generateComplianceReport(req: FinancialReportRequest): Observable<FinancialReportResponse> { return this.http.post<FinancialReportResponse>(`${this.API}/analytics/reports/compliance`, req); }
    getReports(): Observable<FinancialReportResponse[]> { return this.http.get<FinancialReportResponse[]>(`${this.API}/analytics/reports`); }
    getReport(id: number): Observable<FinancialReportResponse> { return this.http.get<FinancialReportResponse>(`${this.API}/analytics/reports/${id}`); }
    getTrends(from: string, to: string): Observable<TransactionTrendPoint[]> { return this.http.get<TransactionTrendPoint[]>(`${this.API}/analytics/trends?from=${from}&to=${to}`); }
}
