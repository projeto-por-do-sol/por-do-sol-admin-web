import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Input } from "../../shared/ui/input/input";
import { Button } from "../../shared/ui/button/button";

@Component({
  selector: 'app-login',
  imports: [Input, Button],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  user = inject(UserService)

  login() {
    this.user.login()
  }

}
