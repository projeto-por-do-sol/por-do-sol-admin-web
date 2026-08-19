import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './core/layout/sidebar/sidebar';
import { filter } from 'rxjs';
import { LoggedUser } from "./core/layout/logged-user/logged-user";
import { User } from './core/models/user-model';
import { UserService } from './core/services/user-service';
import { Login } from './core/layout/login/login';

@Component({
  selector: 'app-root',
  imports: [LoggedUser, Login],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('por-do-sol-admin-web');

  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const fragment = this.route.snapshot.fragment;

        setTimeout(() => {
          if (fragment) {
            document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            this.mainContent?.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
          }
        });
      });
  }

  userService = inject(UserService)
  user = this.userService.user

  // ngOnInit(){
  //   console.log(this.user)
  // }
}