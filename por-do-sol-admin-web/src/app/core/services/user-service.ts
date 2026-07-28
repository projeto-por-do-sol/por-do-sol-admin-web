import { Injectable, signal } from '@angular/core';
import { User } from '../models/user-model';
import { MOCK_USER } from '../mocks/mocks';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private _user = signal<User>(MOCK_USER)

  user = this._user.asReadonly()

}
