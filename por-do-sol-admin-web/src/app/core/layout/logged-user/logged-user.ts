import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-logged-user',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './logged-user.html',
  styleUrl: './logged-user.css',
})
export class LoggedUser { }
