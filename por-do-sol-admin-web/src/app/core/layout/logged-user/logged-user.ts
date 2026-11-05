import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { Sidebar } from '../sidebar/sidebar';
import { OrderService } from '../../services/order-service';
import { KioskService } from '../../services/kiosk-service';
import { KpiService } from '../../services/kpi-service';
import { StatisticsService } from '../../services/statistics-service';
import { NotificationService } from '../../services/notification-service';
import { NewOrderAlertService } from '../../services/new-order-alert-service';
import { PushService } from '../../services/push-service';
import { UserService } from '../../services/user-service';
import { ForcePasswordChangeDialog } from '../../feature/force-password-change-dialog/force-password-change-dialog';

@Component({
  selector: 'app-logged-user',
  imports: [RouterOutlet, Sidebar, ForcePasswordChangeDialog],
  templateUrl: './logged-user.html',
  styleUrl: './logged-user.css',
})
export class LoggedUser {
  @ViewChild('mainContent') mainContent!: ElementRef<HTMLElement>;
  private previousPath = '';
  readonly userService = inject(UserService);
  private readonly pushService = inject(PushService);
  private readonly orderService = inject(OrderService);
  private readonly newOrderAlerts = inject(NewOrderAlertService);
  private readonly notification = inject(NotificationService);
  private readonly kpiService = inject(KpiService);
  private readonly kioskService = inject(KioskService);
  private readonly statisticsService = inject(StatisticsService);

  constructor(private readonly router: Router) {
    // Só chega aqui com sessão válida (authGuard), então o token pode ser enviado à API.
    void this.pushService.register();

    // Novo pedido ou cancelamento: atualiza a lista sem precisar recarregar a página.
    this.pushService.received$
      .pipe(takeUntilDestroyed())
      .subscribe(message => {
        // Avisos silenciosos não têm texto nem mudam a lista de pedidos. Só recarrega o que a tela já carregou.
        if (message.type === 'ATUALIZAR_KPI') {
          if (this.kpiService.kpi().length || this.kpiService.failed()) void this.kpiService.loadKpi();
          // Os cards dos quiosques mostram pedidos, faturamento e tempo médio do dia.
          if (this.kioskService.kiosks().length) void this.kioskService.loadKiosks().catch(() => undefined);
          return;
        }
        if (message.type === 'ATUALIZAR_ESTATISTICAS') {
          if (this.statisticsService.statistics() || this.statisticsService.failed()) void this.statisticsService.load();
          return;
        }
        if (!message.title) return;
        const text = [message.title, message.body].filter(Boolean).join(': ');
        // Pedido finalizado não gera aviso: ele sai da lista de ativos e não é cancelado, então track() retorna false.
        void this.orderService.loadOrders()
          .then(() => message.orderId ? this.newOrderAlerts.track(message.orderId) : true)
          .catch(() => true)
          .then(notify => { if (notify) this.notification.success(text); });
      });

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        const tree = this.router.parseUrl(this.router.url);
        const fragment = tree.fragment;
        const path = tree.root.children['primary']?.segments.map(segment => segment.path).join('/') ?? '';
        const cameFromHome = this.previousPath === 'home';
        this.previousPath = path;

        setTimeout(() => {
          if (fragment && cameFromHome && path === 'home') {
            
            // Já está na Home (conteúdo carregado): scroll suave.
            document
              .getElementById(fragment)
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else if (fragment) {

            // Vindo de outra rota (ex.: formulários): scroll instantâneo e realinhado enquanto carrega.
            this.alignToFragment(fragment);
          } else {
            this.mainContent?.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
          }
        });
      });
  }

  private alignToFragment(id: string): void {
    const container = this.mainContent?.nativeElement;
    if (!container) return;

    const maxDuration = 2500;
    const start = performance.now();
    let frame = 0;
    const userEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

    const stop = () => {
      cancelAnimationFrame(frame);
      userEvents.forEach(name => container.removeEventListener(name, stop));
    };
    userEvents.forEach(name => container.addEventListener(name, stop, { passive: true }));

    const tick = () => {
      const target = document.getElementById(id);
      if (target) {
        const delta = target.getBoundingClientRect().top - container.getBoundingClientRect().top;
        if (Math.abs(delta) > 1) container.scrollTop += delta;
      }
      if (performance.now() - start < maxDuration) frame = requestAnimationFrame(tick);
      else stop();
    };
    frame = requestAnimationFrame(tick);
  }
}
