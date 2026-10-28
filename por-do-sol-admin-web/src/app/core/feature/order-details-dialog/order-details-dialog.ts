import { Component, computed, effect, ElementRef, input, output, viewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { nextOrderStatus, Order, OrderStatus, orderStatusLabel, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from '../../models/order';
import { StatusStyle } from '../../utils/status-style';
import { LocationMap } from '../../shared/ui/location-map/location-map';
import { Button } from '../../shared/ui/button/button';

@Component({
  selector: 'app-order-details-dialog',
  imports: [DatePipe, NgClass, LocationMap, Button],
  templateUrl: './order-details-dialog.html',
  styleUrl: './order-details-dialog.css',
})
export class OrderDetailsDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  readonly order = input<Order | null>(null)
  readonly saving = input(false)
  readonly error = input<string | null>(null)

  readonly statusChange = output<OrderStatus>()
  readonly closed = output<void>()

  readonly nextStatus = computed(() => {
    const order = this.order()
    return order?.status ? nextOrderStatus(order.status, !!order.interno) : undefined
  })

  // Pedidos de cliente em preparo ou em entrega não avançam pelo painel.
  readonly deliveryInApp = computed(() => {
    const order = this.order()
    return !!order && !order.interno && (order.status === 'PREPARANDO' || order.status === 'EM_ENTREGA')
  })

  readonly hasLocation = computed(() => {
    const order = this.order()
    return order?.latitude != null && order?.longitude != null
  })

  // Evita fechar quando o clique começa dentro do modal e termina no fundo (ex.: ao selecionar texto).
  private pressedBackdrop = false

  constructor() {
    // O diálogo fica aberto enquanto houver um pedido selecionado.
    effect(() => {
      const dialog = this.dialog().nativeElement
      if (this.order()) {
        if (!dialog.open) {
          dialog.showModal()
        }
      } else if (dialog.open) {
        dialog.close()
      }
    })
  }

  close(): void {
    this.dialog().nativeElement.close()
  }

  // Com o conteúdo ocupando todo o <dialog>, um clique que tem o próprio <dialog> como alvo veio do fundo.
  onDialogMousedown(event: MouseEvent): void {
    this.pressedBackdrop = event.target === event.currentTarget
  }

  onDialogClick(event: MouseEvent): void {
    if (this.pressedBackdrop && event.target === event.currentTarget) {
      this.close()
    }
    this.pressedBackdrop = false
  }

  formatCurrency(value?: number): string {
    return `R$ ${(value ?? 0).toFixed(2).replace('.', ',')}`
  }

  orderStatus(status: OrderStatus): string {
    return StatusStyle.orderStatus(status)
  }

  orderStatusLabel(status: OrderStatus): string {
    return orderStatusLabel(status)
  }

  paymentMethodLabel(order: Order): string {
    return order.paymentMethod ? PAYMENT_METHOD_LABEL[order.paymentMethod] : 'Não informada'
  }

  paymentStatusLabel(order: Order): string | null {
    return order.paymentStatus ? PAYMENT_STATUS_LABEL[order.paymentStatus] : null
  }
}
