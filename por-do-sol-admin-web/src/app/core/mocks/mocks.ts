import { KioskModel } from "../models/kiosk-model";
import { KpiModel } from "../models/kpi-model";
import { User } from "../models/user-model";

export const MOCK_USER: User = {
  id: "id_mockado",
  name: "Nome do Usuário",
  position: "Gerente",
  kiosk: "Quiosque Santos"
}

export const MOCK_KPI: KpiModel[] = [
  {
    lable: "Pedidos hoje",
    value: "42",
    variation: "12%",
    direction: true,
  }, {
    lable: "Faturamento hoje",
    value: "R$1.780",
    variation: "9%",
    direction: true,
  }, {
    lable: "Ticket médio",
    value: "R$ 42",
    variation: "3%",
    direction: true,
  }, {
    lable: "Tempo médio",
    value: "12 min",
    variation: "2 min",
    direction: false,
  },
]

export const MOCK_KIOSK: KioskModel = {
  id: "id_kiosk",
  name: "Quiosque teste",
  urlImg: "https://www.guiaviagensbrasil.com/imagens/quiosque-praia-monguaga-sp.jpg" ,
  rating: "4.5",
  location: "Praia Grande - Santos",
  startOperation: "08:00",
  finishOperation: "22:00",
  todaysOrders: 42,
  averageTime: 12,
  invoicing: 1780,
  categories: ["Frutos do mar", "Caipirinhas"]
}