import { Component, computed, ElementRef, inject, signal, viewChild } from '@angular/core';
import { NgClass } from '@angular/common';
import { Chips } from "../../shared/ui/chips/chips";
import { TableColumn } from "../../shared/ui/table/table";
import { Order, ORDER_STATUSES, OrderStatus } from '../../models/order';
import { TableOrCard } from "../table-or-card/table-or-card";
import { UserInitials } from '../../utils/user-initials';
import { StatusStyle } from '../../utils/status-style';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { OrderService } from '../../services/order-service';
import { Router } from '@angular/router';
import { OrderStatusActions } from '../order-status-actions/order-status-actions';
import { Button } from '../../shared/ui/button/button';
import { CancelButton } from '../../shared/ui/cancel-button/cancel-button';

@Component({
  selector: 'app-orders',
  imports: [Chips, TableOrCard, NgClass, SectionTitle, OrderStatusActions, Button, CancelButton],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  readonly ordersService = inject(OrderService)
  router = inject(Router)

  readonly chipOptions: string[] = ['Todos', 'Ativos', ...ORDER_STATUSES.filter(status => status !== 'Atrasado')]
  readonly standardOption: string = this.chipOptions[0]

  readonly selectedFilter = signal<string>(this.standardOption)
  readonly pendingOrder = signal<Order | null>(null)
  private readonly finishDialog = viewChild<ElementRef<HTMLDialogElement>>('finishDialog')

  readonly tableOrders = computed(() => {
    const orders = this.ordersService.orders()
    const filter = this.selectedFilter().toLowerCase()

    if (filter === 'todos') {
      return orders
    }

    if (filter === 'ativos') {
      return orders.filter(order => order.status && order.status !== 'Finalizado' && order.status !== 'Cancelado')
    }

    return orders.filter(order => order.status?.toLowerCase() === filter)
  })

  onSelectedOption(option: string) {
    this.selectedFilter.set(option)
  }

  getNameInitials(name: string) {
    return UserInitials.getNameInitials(name)
  }

  orderStatus(status: string): string {
    return StatusStyle.orderStatus(status)
  }

  changeStatus(order: Order, status: OrderStatus): void {
    if (!order.id) {
      return
    }

    if (status === 'Finalizado') {
      this.pendingOrder.set(order)
      this.finishDialog()?.nativeElement.showModal()
      return
    }

    this.ordersService.updateStatus(order.id, status)
  }

  confirmFinishOrder(): void {
    const order = this.pendingOrder()
    if (order?.id) {
      this.ordersService.updateStatus(order.id, 'Finalizado')
    }
    this.closeFinishDialog()
  }

  closeFinishDialog(): void {
    this.finishDialog()?.nativeElement.close()
    this.pendingOrder.set(null)
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
      formatter: (o) => `R$ ${o.value!.toFixed(2).replace('.', ',')}`
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
