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
    kioskId: "kiosk_01",
    kioskName: "Quiosque teste",
    startShift: "08:00",
    finishShift: "18:00",
    status: true
  },
  {
    id: "employee2",
    name: "Mariana Costa",
    role: "Funcionario",
    kioskId: "kiosk_01",
    kioskName: "Quiosque teste",
    startShift: "08:00",
    finishShift: "16:00",
    status: true
  },
  {
    id: "employee3",
    name: "Lucas Oliveira",
    role: "Funcionario",
    kioskId: "kiosk_02",
    kioskName: "Praia Quiosque",
    startShift: "09:00",
    finishShift: "17:00",
    status: true
  },
  {
    id: "employee4",
    name: "Fernanda Souza",
    role: "Funcionario",
    kioskId: "kiosk_02",
    kioskName: "Praia Quiosque",
    startShift: "10:00",
    finishShift: "18:00",
    status: false
  },
  {
    id: "employee5",
    name: "Gabriel Santos",
    role: "Funcionario",
    kioskId: "kiosk_03",
    kioskName: "Santos Quiosque",
    startShift: "12:00",
    finishShift: "20:00",
    status: true
  },
  {
    id: "employee6",
    name: "Camila Rodrigues",
    role: "Funcionario",
    kioskId: "kiosk_04",
    kioskName: "Beira Mar Quiosque",
    startShift: "14:00",
    finishShift: "22:00",
    status: true
  },
  {
    id: "employee7",
    name: "Thiago Almeida",
    role: "Gerente",
    kioskId: "kiosk_04",
    kioskName: "Beira Mar Quiosque",
    startShift: "16:00",
    finishShift: "00:00",
    status: false
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order1',
    items: ['Porção de Peixe Frito', 'Cerveja Gelada (600ml)'],
    kioskName: 'Quiosque teste',
    kioskId: 'kiosk_01',
    clientName: 'Osvaldo Cunha',
    clientId: 'client1',
    value: 42.00,
    time: '12:38',
    status: 'Novo'
  },
  {
    id: 'order2',
    items: ['Pastel de Carne com Queijo', 'Pastel de Vento', 'Caldo de Cana (500ml)'],
    kioskName: 'Santos Quiosque',
    kioskId: 'kiosk_03',
    clientName: 'Ana Souza',
    clientId: 'client2',
    value: 27.50,
    time: '12:45',
    status: 'Em Preparo'
  },
  {
    id: 'order3',
    items: ['Água de Coco Gelada'],
    kioskName: 'Beira Mar Quiosque',
    kioskId: 'kiosk_04',
    clientName: 'Carlos Eduardo',
    clientId: 'client3',
    value: 15.00,
    time: '13:02',
    status: 'Novo'
  },
  {
    id: 'order4',
    items: ['Açaí 500ml com Leite em Pó', 'Adicional de Banana', 'Adicional de Granola', 'Suco de Laranja'],
    kioskName: 'Santos Quiosque',
    kioskId: 'kiosk_03',
    clientName: 'Mariana Lima',
    clientId: 'client4',
    value: 58.90,
    time: '13:15',
    status: 'Pronto'
  },
  {
    id: 'order5',
    items: ['Cerveja Gelada (600ml)', 'Isca de Frango à Passarinho'],
    kioskName: 'Quiosque teste',
    kioskId: 'kiosk_01',
    clientName: 'Roberto Alves',
    clientId: 'client5',
    value: 31.00,
    time: '13:22',
    status: 'Finalizado'
  },
  {
    id: 'order6',
    items: ['Churros de Doce de Leite com Confeito'],
    kioskName: 'Praia Quiosque',
    kioskId: 'kiosk_02',
    clientName: 'Fernanda Rocha',
    clientId: 'client6',
    value: 12.00,
    time: '13:30',
    status: 'Cancelado'
  },
  {
    id: 'order7',
    items: ['Porção de Camarão Alho e Óleo', 'Caipirinha de Limão'],
    kioskName: 'Praia Quiosque',
    kioskId: 'kiosk_02',
    clientName: 'Julia Mendes',
    clientId: 'client7',
    value: 85.00,
    time: '13:40',
    status: 'Entregando'
  },
  {
    id: 'order8',
    items: ['Milho Verde com Manteiga'],
    kioskName: 'Beira Mar Quiosque',
    kioskId: 'kiosk_04',
    clientName: 'Thiago Costa',
    clientId: 'client8',
    value: 8.00,
    time: '13:42',
    status: 'Atrasado'
  },
  {
    id: 'order9',
    items: ['Isca de Peixe', 'Refrigerante Lata'],
    kioskName: 'Quiosque teste',
    kioskId: 'kiosk_01',
    clientName: 'Luiz Fernando',
    clientId: 'client9',
    value: 55.00,
    time: '13:50',
    status: 'Em Preparo'
  },
  {
    id: 'order10',
    items: ['Sanduíche Natural de Frango', 'Suco de Abacaxi com Hortelã'],
    kioskName: 'Santos Quiosque',
    kioskId: 'kiosk_03',
    clientName: 'Beatriz Silva',
    clientId: 'client10',
    value: 28.50,
    time: '13:55',
    status: 'Pronto'
  },
  {
    id: 'order11',
    items: ['Casquinha de Siri', 'Cerveja Artesanal IPA'],
    kioskName: 'Quiosque teste',
    kioskId: 'kiosk_01',
    clientName: 'Rafael Almeida',
    clientId: 'client11',
    value: 45.00,
    time: '14:00',
    status: 'Entregando'
  },
  {
    id: 'order12',
    items: ['Açaí 300ml', 'Água Mineral sem gás'],
    kioskName: 'Santos Quiosque',
    kioskId: 'kiosk_03',
    clientName: 'Camila Dias',
    clientId: 'client12',
    value: 22.00,
    time: '14:05',
    status: 'Finalizado'
  },
  {
    id: 'order13',
    items: ['Porção de Batata Frita M', 'Guaraná 2L'],
    kioskName: 'Praia Quiosque',
    kioskId: 'kiosk_02',
    clientName: 'Marcelo Oliveira',
    clientId: 'client13',
    value: 35.00,
    time: '14:10',
    status: 'Atrasado'
  },
  {
    id: 'order14',
    items: ['Espetinho de Queijo Coalho', 'Espetinho de Carne'],
    kioskName: 'Beira Mar Quiosque',
    kioskId: 'kiosk_04',
    clientName: 'Larissa Moura',
    clientId: 'client14',
    value: 24.00,
    time: '14:15',
    status: 'Novo'
  },
  {
    id: 'order15',
    items: ['Porção de Lula à Dorê'],
    kioskName: 'Quiosque teste',
    kioskId: 'kiosk_01',
    clientName: 'Gustavo Santos',
    clientId: 'client15',
    value: 65.00,
    time: '14:20',
    status: 'Cancelado'
  }
];
