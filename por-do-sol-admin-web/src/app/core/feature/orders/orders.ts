import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { Chips } from "../../shared/ui/chips/chips";
import { TableColumn } from "../../shared/ui/table/table";
import { FINISHED_ORDER_STATUSES, Order, ORDER_STATUSES, OrderStatus, orderStatusLabel } from '../../models/order';
import { TableOrCard } from "../table-or-card/table-or-card";
import { UserInitials } from '../../utils/user-initials';
import { StatusStyle } from '../../utils/status-style';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { OrderService } from '../../services/order-service';
import { Router } from '@angular/router';
import { OrderStatusActions } from '../order-status-actions/order-status-actions';
import { Button } from '../../shared/ui/button/button';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';
import { emptyVerificationCode, VERIFICATION_CODE_LENGTH, VerificationCode } from '../../shared/ui/verification-code/verification-code';
import { OrderDetailsDialog } from '../order-details-dialog/order-details-dialog';

@Component({
  selector: 'app-orders',
  imports: [Chips, TableOrCard, NgClass, DatePipe, SectionTitle, OrderStatusActions, Button, CancelButton, VerificationCode, OrderDetailsDialog],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  readonly ordersService = inject(OrderService)
  router = inject(Router)

  readonly chipOptions: string[] = ['Todos', ...ORDER_STATUSES.map(orderStatusLabel)]
  readonly standardOption: string = this.chipOptions[0]

  readonly selectedFilter = signal<string>(this.standardOption)
  readonly pendingOrder = signal<Order | null>(null)
  private readonly finishDialog = viewChild<ElementRef<HTMLDialogElement>>('finishDialog')
  private readonly codeDialog = viewChild<ElementRef<HTMLDialogElement>>('codeDialog')
  private readonly codeInput = viewChild(VerificationCode)

  // Guarda só o id para que o modal acompanhe as atualizações do pedido.
  readonly detailsOrderId = signal<string | null>(null)
  readonly detailsOrder = computed(() =>
    this.ordersService.orders().find(order => order.id === this.detailsOrderId()) ?? null)

  readonly codeLength = VERIFICATION_CODE_LENGTH
  readonly codeDigits = signal<string[]>(emptyVerificationCode())
  readonly codeError = signal<string | null>(null)
  readonly submittingCode = signal(false)
  readonly loadError = signal(false)
  readonly actionError = signal<string | null>(null)
  readonly isCodeComplete = computed(() => this.codeDigits().every(digit => digit !== ''))

  readonly tableOrders = computed(() => {
    const orders = this.ordersService.orders()

    const status = this.selectedStatus()

    if (!status) {
      return orders.filter(order => order.status && !FINISHED_ORDER_STATUSES.includes(order.status))
    }

    return orders.filter(order => order.status === status)
  })

  readonly selectedStatus = computed(() =>
    ORDER_STATUSES.find(status => orderStatusLabel(status) === this.selectedFilter()) ?? null)

  constructor() { void this.loadOrders() }

  async loadOrders(): Promise<void> {
    this.loadError.set(false)
    const status = this.selectedStatus()
    try {
      await Promise.all([
        this.ordersService.loadOrders(),
        status && FINISHED_ORDER_STATUSES.includes(status) ? this.ordersService.loadOrdersByStatus(status) : null,
      ])
    } catch {
      this.loadError.set(true)
    }
  }

  onSelectedOption(option: string) {
    this.selectedFilter.set(option)
    const status = this.selectedStatus()
    if (status && FINISHED_ORDER_STATUSES.includes(status)) {
      this.loadError.set(false)
      this.ordersService.loadOrdersByStatus(status).catch(() => this.loadError.set(true))
    }
  }

  isSaving(order: Order): boolean {
    return this.ordersService.isSaving(order)
  }

  formatCurrency(value?: number): string {
    return `R$ ${(value ?? 0).toFixed(2).replace('.', ',')}`
  }

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name)
  }

  isSubItem(item: string): boolean {
    return item.startsWith('- ') || item.startsWith('+ ')
  }

  orderStatus(status: OrderStatus): string {
    return StatusStyle.orderStatus(status)
  }

  orderStatusLabel(status: OrderStatus): string {
    return orderStatusLabel(status)
  }

  async changeStatus(order: Order, status: OrderStatus): Promise<void> {
    if (!order.id || this.isSaving(order)) {
      return
    }

    if (status === 'FINALIZADO') {
      this.pendingOrder.set(order)
      if (order.interno) {
        this.finishDialog()?.nativeElement.showModal()
      } else {
        this.openCodeDialog()
      }
      return
    }

    await this.updateStatus(order, status)
  }

  async confirmFinishOrder(): Promise<void> {
    const order = this.pendingOrder()
    this.closeFinishDialog()
    if (order) {
      await this.updateStatus(order, 'FINALIZADO')
    }
  }

  closeFinishDialog(): void {
    this.finishDialog()?.nativeElement.close()
    this.pendingOrder.set(null)
  }

  openDetails(order: Order): void {
    if (!order.id) return
    this.actionError.set(null)
    this.codeError.set(null)
    this.detailsOrderId.set(order.id)
  }

  closeDetails(): void {
    this.detailsOrderId.set(null)
  }

  // O modal continua aberto e passa a exibir o novo status do pedido.
  async changeDetailsStatus(status: OrderStatus): Promise<void> {
    const order = this.detailsOrder()
    if (!order || this.isSaving(order)) return

    await this.updateStatus(order, status)
  }

  async confirmDetailsCode(code: string): Promise<void> {
    const order = this.detailsOrder()
    if (order) {
      await this.validateCode(order, code)
    }
  }

  private async updateStatus(order: Order, status: OrderStatus): Promise<void> {
    this.actionError.set(null)
    try {
      await this.ordersService.updateStatus(order, status)
    } catch (error) {
      this.actionError.set(this.errorMessage(error, 'Não foi possível alterar o status do pedido.'))
      this.resyncOrders()
    }
  }

  private resyncOrders(): void {
    void this.loadOrders()
  }

  private openCodeDialog(): void {
    this.codeDigits.set(emptyVerificationCode())
    this.codeError.set(null)
    this.codeDialog()?.nativeElement.showModal()
    this.codeInput()?.focus()
  }

  closeCodeDialog(): void {
    this.codeDialog()?.nativeElement.close()
    this.pendingOrder.set(null)
  }

  onCodeChange(digits: string[]): void {
    this.codeDigits.set(digits)
    this.codeError.set(null)
  }

  async confirmCode(): Promise<void> {
    const order = this.pendingOrder()
    if (!order || !this.isCodeComplete()) return

    if (await this.validateCode(order, this.codeDigits().join(''))) {
      this.closeCodeDialog()
    }
  }

  private async validateCode(order: Order, code: string): Promise<boolean> {
    if (this.submittingCode()) return false

    this.submittingCode.set(true)
    this.codeError.set(null)
    try {
      const valid = await this.ordersService.finishWithCode(order, code)
      if (!valid) {
        this.codeError.set('Código incorreto. Confira com o cliente e tente novamente.')
      }
      return valid
    } catch (error) {
      this.codeError.set(this.errorMessage(error, 'Não foi possível validar o código.'))
      this.resyncOrders()
      return false
    } finally {
      this.submittingCode.set(false)
    }
  }

  private errorMessage(error: unknown, fallback: string): string {
    const message = (error as { error?: { message?: string } })?.error?.message
    return typeof message === 'string' && message ? message : fallback
  }

  readonly orderColumns: TableColumn<Order>[] = [
    {
      key: 'clientName',
      header: 'Cliente',
      type: 'avatar'
    },
    {
      key: 'kioskName',
      header: 'Quiosque'
    },
    {
      key: 'items',
      header: 'Itens',
      type: 'list'
    },
    {
      key: 'time',
      header: 'Horário',
    },
    {
      key: 'value',
      header: 'Valor',
      formatter: (o) => this.formatCurrency(o.value)
    },
    {
      key: 'status',
      header: 'Status',
      type: 'statusOrder'
    },
    {
      key: 'actions',
      header: 'Alterar status',
      type: 'template'
    }
  ]

  goToCreateOrder(){
    this.router.navigate(["/createOrder"])
  }
}
