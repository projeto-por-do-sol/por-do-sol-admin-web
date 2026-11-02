import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Subject } from 'rxjs';
import { API_BASE_URL } from '../config/api';
import { FIREBASE_CONFIG, FIREBASE_ENABLED, FIREBASE_VAPID_KEY } from '../config/firebase';

export interface PushMessage {
  title: string
  body: string
  type: string
  orderId?: string
}

@Injectable({
  providedIn: 'root',
})
export class PushService {
  private readonly http = inject(HttpClient)
  private readonly _received = new Subject<PushMessage>()
  private listening = false

  // Pushes recebidos enquanto o painel está aberto.
  readonly received$ = this._received.asObservable()

  // A API guarda um único token por usuário; o último aparelho a registrar é o que recebe.
  async register(): Promise<void> {
    if (!FIREBASE_ENABLED || !(await this.supported())) return
    if (Notification.permission === 'default') await Notification.requestPermission()
    if (Notification.permission !== 'granted') return

    try {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
      await navigator.serviceWorker.ready

      const { getToken } = await import('firebase/messaging')
      const token = await getToken(await this.messaging(), {
        vapidKey: FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      })
      if (!token) return

      await firstValueFrom(this.http.post(`${API_BASE_URL}/me/notification-token`, { token }))
      this.listen()
    } catch (error) {
      console.error('Não foi possível ativar as notificações push.', error)
    }
  }

  // Invalida o token deste navegador para que o próximo usuário não herde os avisos.
  async unregister(): Promise<void> {
    if (!FIREBASE_ENABLED || !(await this.supported())) return

    try {
      const { deleteToken } = await import('firebase/messaging')
      await deleteToken(await this.messaging())
    } catch {
      // Sem token ativo, não há o que remover.
    }
  }

  private listen(): void {
    if (this.listening) return
    this.listening = true

    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type !== 'push-received') return

      const { notification, data } = event.data.payload
      const message: PushMessage = {
        title: notification?.title ?? '',
        body: notification?.body ?? '',
        type: data?.tipo ?? '',
        orderId: data?.idPedido || undefined,
      }

      this._received.next(message)
    })
  }

  private async supported(): Promise<boolean> {
    if (!('Notification' in window && 'serviceWorker' in navigator)) return false

    const { isSupported } = await import('firebase/messaging')
    return isSupported()
  }

  // O SDK do Firebase é pesado, então só é baixado quando as notificações são usadas.
  private async messaging() {
    const [{ initializeApp, getApps }, { getMessaging }] = await Promise.all([
      import('firebase/app'),
      import('firebase/messaging'),
    ])
    return getMessaging(getApps()[0] ?? initializeApp(FIREBASE_CONFIG))
  }
}
