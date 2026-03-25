import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse, UpdateUserRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly API = 'http://localhost:8090/api';
    private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUser();
    }

    private loadUser(): void {
        const user = localStorage.getItem('cts_user');
        if (user) this.currentUserSubject.next(JSON.parse(user));
    }

    get token(): string | null { return localStorage.getItem('cts_token'); }
    get isLoggedIn(): boolean { return !!this.token; }
    get currentUser(): UserResponse | null { return this.currentUserSubject.value; }
    get userRole(): string { return this.currentUser?.role || ''; }
    get userId(): number { return this.currentUser?.userId || 0; }
    get isAdmin(): boolean { return this.userRole === 'ADMIN'; }
    get isOfficer(): boolean { return this.userRole === 'OFFICER'; }
    get isCustomer(): boolean { return this.userRole === 'CUSTOMER'; }
    get canViewAnalytics(): boolean { return this.isAdmin || this.isOfficer; }

    register(req: RegisterRequest): Observable<UserResponse> {
        return this.http.post<UserResponse>(`${this.API}/auth/register`, req);
    }

    login(req: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.API}/auth/login`, req).pipe(
            tap(res => {
                localStorage.setItem('cts_token', res.accessToken);
            })
        );
    }

    fetchProfile(): Observable<UserResponse> {
        return this.http.get<UserResponse>(`${this.API}/users/me`).pipe(
            tap(user => {
                localStorage.setItem('cts_user', JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    updateProfile(req: UpdateUserRequest): Observable<UserResponse> {
        return this.http.patch<UserResponse>(`${this.API}/users/me`, req).pipe(
            tap(user => {
                localStorage.setItem('cts_user', JSON.stringify(user));
                this.currentUserSubject.next(user);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('cts_token');
        localStorage.removeItem('cts_user');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }
}
