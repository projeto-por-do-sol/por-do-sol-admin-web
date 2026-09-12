import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-logged-user',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './logged-user.html',
  styleUrl: './logged-user.css',
})
export class LoggedUser {
  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const fragment = this.router.parseUrl(this.router.url).fragment;

        setTimeout(() => {
          if (fragment) {
            document
              .getElementById(fragment)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            this.mainContent?.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
          }
        });
      });
  }
}
