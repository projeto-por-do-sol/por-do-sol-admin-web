import { Directive, ElementRef, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation-service';


@Directive({
  selector: '[appSectionObserver]',
  standalone: true
})
export class SectionObserverDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly navigation = inject(NavigationService);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.navigation.activeSection.set(this.el.nativeElement.id);
        }
      });
    }, {
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
