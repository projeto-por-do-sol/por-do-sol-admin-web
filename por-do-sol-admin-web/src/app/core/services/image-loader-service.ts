import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, finalize, map, of, shareReplay } from 'rxjs';
import { API_BASE_URL } from '../config/api';

@Injectable({ providedIn: 'root' })
export class ImageLoaderService {
  private readonly http = inject(HttpClient)
  private readonly cache = new Map<string, Observable<string | null>>()

  load(url: string | null | undefined): Observable<string | null> {
    if (!url) return of(null)
    if (!url.startsWith(API_BASE_URL)) return of(url)

    const cached = this.cache.get(url)
    if (cached) return cached

    const request = this.http.get(url, { responseType: 'blob' }).pipe(
      map(blob => URL.createObjectURL(blob)),
      catchError(() => {
        this.cache.delete(url)
        return of(null)
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    )
    this.cache.set(url, request)
    return request
  }
}
