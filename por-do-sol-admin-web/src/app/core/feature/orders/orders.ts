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

  chipOptions: string[] = ["todos", "novo", "Em preparo", "pronto", "Entregue", "atrasado"]
  standardOption: string = this.chipOptions[0]

  orders = MOCK_ORDERS

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
