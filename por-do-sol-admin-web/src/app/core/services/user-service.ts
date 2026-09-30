import { Injectable, signal } from '@angular/core';
import { User } from '../models/user-model';
import { MOCK_USER } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly storageKey = 'apollo-mock-session'

  private readonly _user = signal<User | null>(
    sessionStorage.getItem(this.storageKey) === 'active' ? MOCK_USER : null
  )

  readonly user = this._user.asReadonly()


  logout() {
    sessionStorage.removeItem(this.storageKey)
    this._user.set(null)
  }

  login() {
    sessionStorage.setItem(this.storageKey, 'active')
    this._user.set(MOCK_USER)
  }

}
