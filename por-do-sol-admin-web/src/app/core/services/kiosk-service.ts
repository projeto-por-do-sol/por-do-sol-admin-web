import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, tap } from 'rxjs';
import { KioskModel } from '../models/kiosk-model';
import { CatalogKioskResponse } from '../models/item-api';
import { UserService } from './user-service';
import { API_BASE_URL } from '../config/api';
import { apiImageUrl } from '../utils/api-image-url';
import { KioskRegistrationRequest, KioskRegistrationResponse } from '../models/kiosk-registration';

@Injectable({
  providedIn: 'root',
})
export class KioskService {

  private readonly http = inject(HttpClient)
  private readonly userService = inject(UserService)

  private _kiosks = signal<KioskModel[]>([])
  kiosks = this._kiosks.asReadonly()

  // Garante que seja exibido para o usuário correto. Caso o usuário troque de conta, os dados que estavam carregados, ficam invalidados.
  private loadedForUser: string | null = null
  private loading: Promise<void> | null = null

  ensureKiosks(): Promise<void> {
    const userId = this.userService.user()?.id
    return userId && userId === this.loadedForUser ? Promise.resolve() : this.loadKiosks()
  }

  loadKiosks(): Promise<void> {
    if (this.loading) return this.loading
    this.loading = this.fetchKiosks().finally(() => this.loading = null)
    return this.loading
  }

  private async fetchKiosks(): Promise<void> {
    const user = await firstValueFrom(this.userService.restoreSession())
    const endpoint = user.role === 'proprietario' ? '/empresas/me/overview/quiosques' : '/quiosques/me'
    const response = await firstValueFrom(this.http.get<CatalogKioskResponse | CatalogKioskResponse[]>(`${API_BASE_URL}${endpoint}`))
    const records = Array.isArray(response) ? response : [response]
    this._kiosks.set(records.map(record => ({
      id: String(record.id), name: record.nome, location: `${record.cidade ?? ''}, ${record.uf ?? ''}`,
      startOperation: record.openingTime, finishOperation: record.closingTime,
      categories: (record.categorias ?? []).map((category) => typeof category === 'string' ? category : category.nome),
      urlImg: apiImageUrl(record.imagem), rating: String(record.nota ?? 0),
      todaysOrders: record.pedidosHoje ?? 0, averageTime: record.tempoMedio ?? 0, invoicing: record.faturamentoHoje ?? 0,
    })))
    this.loadedForUser = user.id ?? null
    this.isOpen()
  }

  registerKiosk(request: KioskRegistrationRequest): Observable<KioskRegistrationResponse> {
    return this.http.post<KioskRegistrationResponse>(`${API_BASE_URL}/quiosques`, request).pipe(
      tap(response => {
        const kiosk: KioskModel = {
          id: String(response.id),
          name: response.nome,
          location: `${response.cidade}, ${response.uf}`,
          startOperation: response.openingTime.slice(0, 5),
          finishOperation: response.closingTime.slice(0, 5),
          categories: [],
          rating: '0',
          todaysOrders: 0,
          averageTime: 0,
          invoicing: 0,
        }
        this._kiosks.update(kiosks => [...kiosks.filter(item => item.id !== kiosk.id), kiosk])
        this.isOpen()
      }),
    )
  }

  uploadKioskImage(kioskId: number, image: File): Observable<string> {
    const formData = new FormData()
    formData.append('file', image)

    return this.http.post(`${API_BASE_URL}/quiosques/${kioskId}/imagem`, formData, {
      responseType: 'text',
    }).pipe(
      tap(fileName => this._kiosks.update(kiosks => kiosks.map(kiosk =>
        kiosk.id === String(kioskId)
          ? { ...kiosk, urlImg: apiImageUrl(`/uploads/${encodeURIComponent(fileName.trim())}`) }
          : kiosk,
      ))),
    )
  }

  addCategory(kioskId: string, categoryName: string): boolean {
    const name = categoryName.trim().replace(/\s+/g, ' ')
    const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR')
    const kiosk = this._kiosks().find(item => item.id === kioskId)
    if (!name || !kiosk || kiosk.categories?.some(category => normalize(category) === normalize(name))) return false

    this._kiosks.update(kiosks => kiosks.map(item => item.id === kioskId
      ? { ...item, categories: [...(item.categories ?? []), name] }
      : item))
    return true
  }

  // ngOnInit() {
  //   this.isOpen()
  // }

  constructor() {
    this.isOpen()
  }

  isOpen() {
    const now = new Date();
    let nowInMinutes = now.getHours() * 60 + now.getMinutes();

    for (const kiosk of this._kiosks()) {
      if (!kiosk.startOperation || !kiosk.finishOperation) {
        continue;
      }

      const [startHour, startMinute] = kiosk.startOperation.split(':').map(Number);
      const [finishHour, finishMinute] = kiosk.finishOperation.split(':').map(Number);

      const startInMinutes = startHour * 60 + startMinute;
      let finishInMinutes = finishHour * 60 + finishMinute;

      let currentMinutes = nowInMinutes;

      if (finishInMinutes <= startInMinutes) {
        finishInMinutes += 24 * 60;

        if (currentMinutes < startInMinutes) {
          currentMinutes += 24 * 60;
        }
      }

      kiosk.isOpen = currentMinutes >= startInMinutes &&
        currentMinutes <= finishInMinutes;

    }
  }
}
