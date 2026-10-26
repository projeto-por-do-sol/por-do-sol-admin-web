import { Component, computed, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { nextOrderStatus, Order, OrderStatus, orderStatusLabel, PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from '../../models/order';
import { StatusStyle } from '../../utils/status-style';
import { LocationMap } from '../../shared/ui/location-map/location-map';
import { Button } from '../../shared/ui/button/button';
import { emptyVerificationCode, VERIFICATION_CODE_LENGTH, VerificationCode } from '../../shared/ui/verification-code/verification-code';

@Component({
  selector: 'app-order-details-dialog',
  imports: [DatePipe, NgClass, LocationMap, Button, VerificationCode],
  templateUrl: './order-details-dialog.html',
  styleUrl: './order-details-dialog.css',
})
export class OrderDetailsDialog {
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog')

  readonly order = input<Order | null>(null)
  readonly saving = input(false)
  readonly error = input<string | null>(null)
  readonly codeError = input<string | null>(null)
  readonly submittingCode = input(false)

  readonly statusChange = output<OrderStatus>()
  readonly codeConfirm = output<string>()
  readonly codeChange = output<void>()
  readonly closed = output<void>()

  readonly codeLength = VERIFICATION_CODE_LENGTH
  readonly codeDigits = signal<string[]>(emptyVerificationCode())
  readonly isCodeComplete = computed(() => this.codeDigits().every(digit => digit !== ''))

  readonly nextStatus = computed(() => {
    const status = this.order()?.status
    return status ? nextOrderStatus(status) : undefined
  })

  readonly needsCode = computed(() => this.order()?.status === 'EM_ENTREGA' && !this.order()?.interno)

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
          this.codeDigits.set(emptyVerificationCode())
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

  onCodeChange(digits: string[]): void {
    this.codeDigits.set(digits)
    this.codeChange.emit()
  }

  confirmCode(): void {
    if (!this.isCodeComplete() || this.submittingCode()) return
    this.codeConfirm.emit(this.codeDigits().join(''))
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
