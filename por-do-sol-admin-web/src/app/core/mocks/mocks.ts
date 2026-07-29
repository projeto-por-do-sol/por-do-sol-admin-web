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

export const MOCK_KIOSKS: KioskModel[] = [
  {
    id: "id_kiosk",
    name: "Quiosque teste",
    urlImg: "https://www.guiaviagensbrasil.com/imagens/quiosque-praia-monguaga-sp.jpg",
    rating: "4.5",
    location: "Praia Grande - Santos",
    startOperation: "08:00",
    finishOperation: "22:00",
    todaysOrders: 42,
    averageTime: 12,
    invoicing: 1780,
    categories: ["Frutos do mar", "Caipirinhas"]
  },
  {
    id: "id_kiosk2",
    name: "Praia Quiosque",
    urlImg: "https://www.orlario.com.br/wp-content/uploads/2022/10/classico-beach-club-recreio-11-scaled.jpg",
    rating: "4.5",
    location: "Praia Grande - Santos",
    startOperation: "08:00",
    finishOperation: "22:00",
    todaysOrders: 42,
    averageTime: 12,
    invoicing: 1780,
    categories: ["Frutos do mar", "Caipirinhas"]
  },
  {
    id: "id_kiosk3",
    name: "Santos Quiosque",
    urlImg: "https://invexo.com.br/blog/wp-content/uploads/2020/01/quiosque-praia-de-s%C3%A3o-conrado.jpg.webp",
    rating: "4.5",
    location: "Praia Grande - Santos",
    startOperation: "08:00",
    finishOperation: "22:00",
    todaysOrders: 42,
    averageTime: 12,
    invoicing: 1780,
    categories: ["Frutos do mar", "Caipirinhas"]
  },
  {
    id: "id_kiosk4",
    name: "Beira Mar Quiosque",
    urlImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTDV3yYC4sgc8PKchzlcFMZ1r6yTfeNwedUXU4Qah0xNF3G33E4jUV7Mm2&s=10",
    rating: "4.5",
    location: "Praia Grande - Santos",
    startOperation: "08:00",
    finishOperation: "22:00",
    todaysOrders: 42,
    averageTime: 12,
    invoicing: 1780,
    categories: ["Frutos do mar", "Caipirinhas"]
  },
]