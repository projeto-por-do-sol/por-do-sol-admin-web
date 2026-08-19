import { Injectable, signal } from '@angular/core';
import { User } from '../models/user-model';
import { MOCK_USER } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private readonly _user = signal<User | null>(null)

  user = this._user.asReadonly()


  logout() {
    this._user.set(null)
  }

  login() {
    this._user.set(MOCK_USER)
  }

}

