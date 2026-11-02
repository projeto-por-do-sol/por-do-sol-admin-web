import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthTokenService {
  private readonly storageKey = 'apollo-token';

  get(): string | null {
    return sessionStorage.getItem(this.storageKey) ?? localStorage.getItem(this.storageKey);
  }

  save(token: string, rememberMe: boolean): void {
    this.clear();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.storageKey, token);
  }

  /** Indica se o token está salvo para persistir entre sessões ("lembrar de mim"). */
  isPersistent(): boolean {
    return !sessionStorage.getItem(this.storageKey) && !!localStorage.getItem(this.storageKey);
  }

  /** Lê a claim `trocarSenha` do JWT: true enquanto a senha provisória não foi trocada. */
  mustChangePassword(): boolean {
    const token = this.get();
    if (!token) return false;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(payload).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join(''),
      );
      return JSON.parse(json).trocarSenha === true;
    } catch {
      return false;
    }
  }

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);
  }
}
