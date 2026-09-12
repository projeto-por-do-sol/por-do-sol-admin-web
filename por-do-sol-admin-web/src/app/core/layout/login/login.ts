import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Input } from "../../shared/ui/input/input";
import { Button } from "../../shared/ui/button/button";
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [Input, Button, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  login() {
    this.userService.login();
    this.router.navigateByUrl('/home');
  }
}
