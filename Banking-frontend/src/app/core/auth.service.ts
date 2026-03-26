import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse, UserResponse, UpdateUserRequest } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:8090/api';
  private _user = signal<UserResponse | null>(null);
  unreadCount = signal(0);

  readonly currentUser = this._user.asReadonly();
  readonly isLoggedIn   = computed(() => !!this.token);
  readonly isAdmin      = computed(() => this._user()?.role === 'ADMIN');
  readonly isOfficer    = computed(() => this._user()?.role === 'OFFICER');
  readonly isCustomer   = computed(() => this._user()?.role === 'CUSTOMER');
  readonly canAnalytics = computed(() => this.isAdmin() || this.isOfficer());
  readonly userId       = computed(() => this._user()?.userId ?? 0);

  constructor(private http: HttpClient, private router: Router) {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof localStorage === 'undefined') return;
    const stored = localStorage.getItem('cts_user');
    if (stored) this._user.set(JSON.parse(stored));
  }

  get token(): string | null {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('cts_token') : null;
  }

  register(req: RegisterRequest): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API}/auth/register`, req);
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, req).pipe(
      tap(res => localStorage.setItem('cts_token', res.accessToken))
    );
  }

  fetchProfile(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.API}/users/me`).pipe(
      tap(u => { localStorage.setItem('cts_user', JSON.stringify(u)); this._user.set(u); })
    );
  }

  updateProfile(req: UpdateUserRequest): Observable<UserResponse> {
    return this.http.patch<UserResponse>(`${this.API}/users/me`, req).pipe(
      tap(u => { localStorage.setItem('cts_user', JSON.stringify(u)); this._user.set(u); })
    );
  }

  logout(): void {
    localStorage.removeItem('cts_token');
    localStorage.removeItem('cts_user');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}
