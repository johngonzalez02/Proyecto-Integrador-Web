import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config/api.config';
import { User, UserRole } from '../interfaces/user.interface';

const STORAGE_KEY = 'eventapp.user';

/** Autenticación y usuario en sesión. */
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private router = inject(Router);

  readonly currentUser = signal<User | null>(this.load());

  login(correo: string, password: string): Observable<User> {
    return this.http
      .post<User>(`${API_URL}/auth/login`, { correo, password })
      .pipe(tap((user) => this.save(user)));
  }

  register(data: Record<string, unknown>): Observable<User> {
    return this.http
      .post<User>(`${API_URL}/auth/register`, data)
      .pipe(tap((user) => this.save(user)));
  }

  logout(): void {
    this.currentUser.set(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* sin almacenamiento */ }
    this.router.navigate(['/login']);
  }

  homeFor(role: UserRole | null): string {
    return role ? `/${role}` : '/login';
  }

  private save(user: User): void {
    this.currentUser.set(user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* sin almacenamiento */ }
  }

  private load(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }
}