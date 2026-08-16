import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Chips } from "../../shared/ui/chips/chips";
import { Table, TableColumn } from "../../shared/ui/table/table";
import { Order } from '../../models/order';
import { TableOrCard } from "../table-or-card/table-or-card";
import { UserInitials } from '../../utils/user-initials';
import { StatusStyle } from '../../utils/status-style';
import { SectionTitle } from "../../shared/ui/section-title/section-title";
import { OrderService } from '../../services/order-service';

@Component({
  selector: 'app-orders',
  imports: [Chips, Table, TableOrCard, NgClass, SectionTitle],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {
  readonly ordersService = inject(OrderService)

  readonly chipOptions: string[] = ["todos", "novo", "Em preparo", "pronto", "Entregando", "Finalizado", "atrasado", "cancelado"]
  readonly standardOption: string = this.chipOptions[0]

  readonly selectedFilter = signal<string>("todos")

  readonly tableOrders = computed(() => {
    const orders = this.ordersService.orders()
    const filter = this.selectedFilter().toLowerCase()

    if (filter === 'todos') {
      return orders;
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
    }
  ]

  aa(){}
}