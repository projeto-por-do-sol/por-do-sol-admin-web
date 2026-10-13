import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  private readonly snackBar = inject(MatSnackBar)

  success(message: string): void {
    this.snackBar.open(message, undefined, { duration: 3000, panelClass: 'app-snackbar' })
  }

  error(message: string, duration = 6000): void {
    this.snackBar.open(message, undefined, { duration, panelClass: 'app-snackbar-error' })
  }

}
