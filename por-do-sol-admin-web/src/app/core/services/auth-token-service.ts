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

  clear(): void {
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);
  }
}
