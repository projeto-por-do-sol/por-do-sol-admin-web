import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, concat, last, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../models/user-model';
import {
  AuthenticatedUserResponse,
  LoginRequest,
  LoginResponse,
  ChangePasswordRequest,
  OwnerRegistrationRequest,
  UpdateProfileRequest,
} from '../models/auth-model';
import { API_BASE_URL } from '../config/api';
import { AuthTokenService } from './auth-token-service';
import { PushService } from './push-service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(AuthTokenService);
  private readonly pushService = inject(PushService);
  private readonly _user = signal<User | null>(null);

  private readonly _mustChangePassword = signal(false);

  readonly user = this._user.asReadonly();
  /** True enquanto o funcionário/gerente usa a senha provisória e precisa trocá-la. */
  readonly mustChangePassword = this._mustChangePassword.asReadonly();

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

  updateProfile(
    profile: UpdateProfileRequest,
    options: { password?: ChangePasswordRequest, image?: File | null, removeImage?: boolean } = {},
  ): Observable<{ emailChanged: boolean }> {
    const currentEmail = this._user()?.email?.trim().toLowerCase() ?? ''
    const emailChanged = profile.email.trim().toLowerCase() !== currentEmail
    const updateData = this.http.put<AuthenticatedUserResponse>(`${API_BASE_URL}/me`, profile)
    const otherSteps: Observable<unknown>[] = []

    if (options.password) {
      otherSteps.push(this.http.patch(`${API_BASE_URL}/me`, options.password))
    }

    if (options.image) {
      const formData = new FormData()
      formData.append('file', options.image)
      otherSteps.push(this.http.post(`${API_BASE_URL}/me/imagem`, formData, { responseType: 'text' }))
    } else if (options.removeImage) {
      otherSteps.push(this.http.delete(`${API_BASE_URL}/me/imagem`))
    }

    const steps = emailChanged ? [...otherSteps, updateData] : [updateData, ...otherSteps]

    return concat(...steps).pipe(
      last(),
      switchMap(() => emailChanged ? of(null) : this.loadAuthenticatedUser()),
      map(() => ({ emailChanged })),
    )
  }

  /**
   * Troca a senha provisória. O JWT atual ainda carrega `trocarSenha`, então
   * o login é refeito com a nova senha para obter um token já liberado.
   */
  changeTemporaryPassword(request: ChangePasswordRequest): Observable<User> {
    const login = this._user()?.login ?? this._user()?.email ?? '';
    const rememberMe = this.tokenService.isPersistent();

    return this.http.patch<void>(`${API_BASE_URL}/me`, request).pipe(
      switchMap(() => this.login({ email: login, password: request.novaSenha }, rememberMe)),
    );
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
    void this.pushService.unregister();
    this.clearSession();
  }

  private loadAuthenticatedUser(): Observable<User> {
    return this.http.get<AuthenticatedUserResponse>(`${API_BASE_URL}/me`).pipe(
      map(response => this.mapUser(response)),
      tap(user => {
        this._user.set(user);
        this._mustChangePassword.set(this.tokenService.mustChangePassword());
      }),
    )
  }

  private clearSession(): void {
    this.tokenService.clear();
    this._user.set(null);
    this._mustChangePassword.set(false);
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
      email: response.email ?? undefined,
      login: response.login,
      phone: response.telefone,
      registrationDate: response.dataCadastro,
      image: response.imagem,
      role: response.role,
      position: positions[response.role],
    }
  }
}
