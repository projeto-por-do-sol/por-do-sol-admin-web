import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Sidebar } from './core/layout/sidebar/sidebar';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
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
}