import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { API_BASE_URL } from '../config/api';
import { AuthTokenService } from '../services/auth-token-service';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(AuthTokenService).get()
  
  if (!token || !request.url.startsWith(API_BASE_URL)) {
    return next(request)
  }

  return next(request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  }))
}
