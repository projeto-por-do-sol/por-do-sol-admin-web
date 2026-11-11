import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../config/api';
import { AuthTokenService } from '../services/auth-token-service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_BASE_URL)) {
    return next(request)
  }

  const token = inject(AuthTokenService).get()
  const headers: Record<string, string> = { 'ngrok-skip-browser-warning': 'true' }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return next(request.clone({ setHeaders: headers }))
}
