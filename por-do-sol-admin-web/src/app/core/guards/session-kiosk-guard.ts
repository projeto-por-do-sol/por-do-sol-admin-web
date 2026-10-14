import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, firstValueFrom } from 'rxjs';
import { UserService } from '../services/user-service';
import { KioskService } from '../services/kiosk-service';
import { KioskSelectionService } from '../services/kiosk-selection-service';

// Gerente e funcionário trabalham em um único quiosque: ele é selecionado automaticamente
// e a Home passa a se comportar como a do proprietário com esse quiosque selecionado.
export const sessionKioskGuard: CanActivateFn = async () => {
  const userService = inject(UserService)
  const kioskService = inject(KioskService)
  const selectionService = inject(KioskSelectionService)
  const router = inject(Router)

  // Os guards de um mesmo canActivate rodam em paralelo, então não dá para depender do authGuard.
  const user = await firstValueFrom(userService.restoreSession().pipe(catchError(() => [null])))
  if (!user) return router.createUrlTree(['/login'])
  if (user.role === 'proprietario') return true

  try {
    await kioskService.ensureKiosks()
  } catch {

  }

  const kioskId = kioskService.kiosks()[0]?.id
  if (!kioskId) {
    userService.logout()
    return router.createUrlTree(['/login'], { queryParams: { semQuiosque: 1 } })
  }

  selectionService.selectKiosk(kioskId)
  return true
}
