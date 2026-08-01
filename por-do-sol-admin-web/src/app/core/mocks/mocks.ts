import { Employee } from "../models/employee";
import { KioskModel } from "../models/kiosk-model";
import { KpiModel } from "../models/kpi-model";
import { Order } from "../models/order";
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
    id: "kiosk_01",
    name: "Quiosque teste",
    urlImg: "https://www.guiaviagensbrasil.com/imagens/quiosque-praia-monguaga-sp.jpg",
    rating: "4.8",
    location: "Praia do Gonzaga - Santos",
    startOperation: "07:30",
    finishOperation: "21:00",
    todaysOrders: 58,
    averageTime: 15,
    invoicing: 2450,
    categories: ["Frutos do mar", "Porções", "Cerveja trincando"]
  },
  {
    id: "kiosk_02",
    name: "Praia Quiosque",
    urlImg: "https://www.orlario.com.br/wp-content/uploads/2022/10/classico-beach-club-recreio-11-scaled.jpg",
    rating: "4.2",
    location: "Praia da Boqueirão - Santos",
    startOperation: "09:00",
    finishOperation: "23:20",
    todaysOrders: 31,
    averageTime: 18,
    invoicing: 1320,
    categories: ["Drinks artesanais", "Lanches", "Caipirinhas"]
  },
  {
    id: "kiosk_03",
    name: "Santos Quiosque",
    urlImg: "https://invexo.com.br/blog/wp-content/uploads/2020/01/quiosque-praia-de-s%C3%A3o-conrado.jpg.webp",
    rating: "4.9",
    location: "Praia do José Menino - Santos",
    startOperation: "08:00",
    finishOperation: "22:30",
    todaysOrders: 74,
    averageTime: 10,
    invoicing: 3890,
    categories: ["Açaí", "Sucos naturais", "Pastéis"]
  },
  {
    id: "kiosk_04",
    name: "Beira Mar Quiosque",
    urlImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTDV3yYC4sgc8PKchzlcFMZ1r6yTfeNwedUXU4Qah0xNF3G33E4jUV7Mm2&s=10",
    rating: "4.4",
    location: "Praia da Aparecida - Santos",
    startOperation: "10:00",
    finishOperation: "02:00",
    todaysOrders: 25,
    averageTime: 14,
    invoicing: 980,
    categories: ["Sorvetes", "Petiscos", "Água de coco"]
  },
];

export const MOCK_EMPLOYEE: Employee[] = [
  {
    id: "employee1",
    name: "Rodolfo da Silva",
    role: "Gerente",
    kiosk: "Praia Quiosque",
    startShift: "08:00",
    finishShift: "18:00",
    status: true
  },
  {
    id: "employee2",
    name: "Mariana Costa",
    role: "Funcionario",
    kiosk: "Praia Quiosque",
    startShift: "08:00",
    finishShift: "16:00",
    status: true
  },
  {
    id: "employee3",
    name: "Lucas Oliveira",
    role: "Funcionario",
    kiosk: "Quiosque Sol & Mar",
    startShift: "09:00",
    finishShift: "17:00",
    status: true
  },
  {
    id: "employee4",
    name: "Fernanda Souza",
    role: "Funcionario",
    kiosk: "Praia Quiosque",
    startShift: "10:00",
    finishShift: "18:00",
    status: false
  },
  {
    id: "employee5",
    name: "Gabriel Santos",
    role: "Funcionario",
    kiosk: "Quiosque Sol & Mar",
    startShift: "12:00",
    finishShift: "20:00",
    status: true
  },
  {
    id: "employee6",
    name: "Camila Rodrigues",
    role: "Funcionario",
    kiosk: "Quiosque Tropical",
    startShift: "14:00",
    finishShift: "22:00",
    status: true
  },
  {
    id: "employee7",
    name: "Thiago Almeida",
    role: "Gerente",
    kiosk: "Quiosque Tropical",
    startShift: "16:00",
    finishShift: "00:00",
    status: false
  }
]

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order1',
    items: ['Porção de Peixe Frito', 'Cerveja Gelada (600ml)'],
    kioskName: 'Barraca do Zé',
    kioskId: 'kiosk1',
    clientName: "Osvaldo Cunha",
    clientId: 'client1',
    value: 42.00,
    time: '12:38',
    status: 'Novo'
  },
  {
    id: 'order2',
    items: ['Pastel de Carne com Queijo', 'Pastel de Vento', 'Caldo de Cana (500ml)'],
    kioskName: 'Pastelaria da Maria',
    kioskId: 'kiosk2',
    clientName: 'Ana Souza',
    clientId: 'client2',
    value: 27.50,
    time: '12:45',
    status: 'Em Preparo'
  },
  {
    id: 'order3',
    items: ['Água de Coco Gelada'],
    kioskName: 'Quiosque da Praia',
    kioskId: 'kiosk3',
    clientName: 'Carlos Eduardo',
    clientId: 'client3',
    value: 15.00,
    time: '13:02',
    status: 'Novo'
  },
  {
    id: 'order4',
    items: ['Açaí 500ml com Leite em Pó', 'Adicional de Banana', 'Adicional de Granola', 'Sucos de Laranja'],
    kioskName: 'Açaí do Beto',
    kioskId: 'kiosk4',
    clientName: 'Mariana Lima',
    clientId: 'client4',
    value: 58.90,
    time: '13:15',
    status: 'Pronto'
  },
  {
    id: 'order5',
    items: ['Cerveja Gelada (600ml)', 'Isca de Frango à Passarinho'],
    kioskName: 'Barraca do Zé',
    kioskId: 'kiosk1',
    clientName: 'Roberto Alves',
    clientId: 'client5',
    value: 31.00,
    time: '13:22',
    status: 'Entregue'
  },
  {
    id: 'order6',
    items: ['Churros de Doce de Leite com Confeito'],
    kioskName: 'Churros do Chaves',
    kioskId: 'kiosk5',
    clientName: 'Fernanda Rocha',
    clientId: 'client6',
    value: 12.00,
    time: '13:30',
    status: 'Cancelado'
  }
]