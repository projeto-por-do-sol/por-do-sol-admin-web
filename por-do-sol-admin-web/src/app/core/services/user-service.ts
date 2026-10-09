import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../models/user-model';
import {
  AuthenticatedUserResponse,
  LoginRequest,
  LoginResponse,
  OwnerRegistrationRequest,
} from '../models/auth-model';
import { API_BASE_URL } from '../config/api';
import { AuthTokenService } from './auth-token-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(AuthTokenService);
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();

  login(credentials: LoginRequest, rememberMe = false): Observable<User> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login/quiosque`, credentials).pipe(
      tap(({ token }) => this.tokenService.save(token, rememberMe)),
      switchMap(() => this.loadAuthenticatedUser()),
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      }),
    );
  }

  registerOwner(
    registration: OwnerRegistrationRequest,
    profileImage: File | null = null,
  ): Observable<User> {
    const credentials: LoginRequest = {
      email: registration.email,
      password: registration.password,
    }

    return this.http
      .post<AuthenticatedUserResponse>(`${API_BASE_URL}/auth/register`, registration)
      .pipe(
        switchMap(() => this.login(credentials)),
        switchMap(user => {
          if (!profileImage) return of(user)

          const formData = new FormData()
          formData.append('file', profileImage)

          return this.http
            .post(`${API_BASE_URL}/me/imagem`, formData, { responseType: 'text' })
            .pipe(
              switchMap(() => this.loadAuthenticatedUser()),
              catchError(() => of(user)),
            )
        }),
      )
  }

  restoreSession(): Observable<User> {
    const currentUser = this._user();
    if (currentUser) return of(currentUser);

    if (!this.tokenService.get()) {
      return throwError(() => new Error('Usuário não autenticado'));
    }

    return this.loadAuthenticatedUser().pipe(
      catchError(error => {
        this.clearSession();
        return throwError(() => error);
      }),
    )
  }

  logout() {
    this.clearSession();
  }

  private loadAuthenticatedUser(): Observable<User> {
    return this.http.get<AuthenticatedUserResponse>(`${API_BASE_URL}/me`).pipe(
      map(response => this.mapUser(response)),
      tap(user => this._user.set(user)),
    )
  }

  private clearSession(): void {
    this.tokenService.clear();
    this._user.set(null);
  }

  private mapUser(response: AuthenticatedUserResponse): User {
    const positions: Record<AuthenticatedUserResponse['role'], string> = {
      proprietario: 'Proprietário',
      gerente: 'Gerente',
      funcionario: 'Funcionário',
    }

    return {
      id: response.id,
      name: response.nome,
      email: response.email,
      phone: response.telefone,
      registrationDate: response.dataCadastro,
      image: response.imagem,
      role: response.role,
      position: positions[response.role],
    }
  }
}
