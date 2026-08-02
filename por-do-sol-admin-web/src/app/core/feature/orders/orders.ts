import { Component } from '@angular/core';
import { Chips } from "../../shared/ui/chips/chips";
import { Table, TableColumn } from "../../shared/ui/table/table";
import { Order } from '../../models/order';
import { MOCK_ORDERS } from '../../mocks/mocks';

@Component({
  selector: 'app-orders',
  imports: [Chips, Table],
  templateUrl: './orders.html',
  styleUrl: './orders.css',
})
export class Orders {

  chipOptions: string[] = ["todos", "novo", "Em preparo", "pronto", "Entregando", "Finalizado", "atrasado", "cancelado"]
  standardOption: string = this.chipOptions[0]

  allOrders = MOCK_ORDERS
  tableOrders = this.allOrders

  onSelectedOption(option: string) {
    switch (option.toLowerCase()) {
      case "novo":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'novo');
        break;

      case "em preparo":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'em preparo');
        break;

      case "pronto":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'pronto');
        break;

      case "entregando":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'entregando');
        break;

      case "finalizado":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'finalizado');
        break;

      case "atrasado":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'atrasado');
        break;

      case "cancelado":
        this.tableOrders = this.allOrders.filter(order => order.status?.toLowerCase() === 'cancelado');
        break;

      default:
        this.tableOrders = this.allOrders;
    }
  }

  orderColumns: TableColumn<Order>[] = [
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
  ];
}
