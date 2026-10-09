import { Component, inject, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { KioskSelectionService } from '../../../../services/kiosk-selection-service';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-stacked-column',
  imports: [NgApexchartsModule],
  templateUrl: './stacked-column.html',
  styleUrl: './stacked-column.css',
})
export class StackedColumn {
  @ViewChild('chart') chart!: ChartComponent;
  private readonly selectionService = inject(KioskSelectionService);

  get chartOptions(): ChartOptions {
    return this.selectionService.selectedKiosk()
      ? this.productChartOptions
      : this.companyChartOptions;
  }

  private readonly companyChartOptions: ChartOptions = {
    series: [
      { name: 'Quiosque Teste', data: [1620, 1840, 2110, 1980, 2450, 2860, 2710] },
      { name: 'Praia Quiosque', data: [980, 1120, 1050, 1230, 1320, 1680, 1590] },
      { name: 'Santos Quiosque', data: [2540, 2780, 3010, 3260, 3890, 4210, 3980] },
      { name: 'Beira Mar Quiosque', data: [720, 810, 760, 890, 980, 1260, 1170] },
    ],
    chart: {
      type: 'bar',
      height: 350,
      stacked: true,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
    colors: [
      '#E8754A',
      '#D95825',
      '#C0420A',
      '#A63708',
      '#852C06',
      '#632004',
      '#3D1302',
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 16,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: '14px',
              fontWeight: 900,
              color: '#000',
            },
          },
        },
      },
    },
    title: {
      text: 'Faturamento dos quiosques por dia',
      align: 'left',
      style: {
        color: 'var(--color-outline)',
        fontWeight: 'semibold',
        fontFamily: 'var(--font-poppins)',
      },
    },
    subtitle: {
      text: 'Últimos 7 dias',
      align: 'left',
      style: {
        color: 'var(--color-sub-text)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-poppins)',
      },
    },
    xaxis: {
      categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
    },
    yaxis: {
      labels: {
        formatter: (value) => new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value),
      },
    },
    legend: {
      position: 'right',
      offsetY: 40,
      fontFamily: 'var(--font-poppins)',
      fontWeight: 'semibold',
      fontSize: '0.8rem',
    },
    fill: { opacity: 1 },
  };

  private readonly productChartOptions: ChartOptions = {
    series: [
      {
        name: 'Unidades vendidas',
        data: [58, 46, 39, 32, 25],
      },
    ],
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true },
    },
    theme: {
      mode: 'light',
      palette: 'palette1',
    },
    colors: ['#E8754A', '#D95825', '#C0420A', '#A63708', '#852C06'],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 420 },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        borderRadius: 8,
        borderRadiusApplication: 'end',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (value) => `${value}`,
      style: {
        fontFamily: 'var(--font-poppins)',
      },
    },
    title: {
      text: 'Produtos mais vendidos',
      align: 'left',
      style: {
        color: 'var(--color-outline)',
        fontWeight: 'semibold',
        fontFamily: 'var(--font-poppins)',
      },
    },
    subtitle: {
      text: 'Quantidade vendida nos últimos 7 dias',
      align: 'left',
      style: {
        color: 'var(--color-sub-text)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-poppins)',
      },
    },
    xaxis: {
      categories: [
        'Porção de Peixe Frito',
        'Casquinha de Siri',
        'Pastel de Carne com Queijo',
        'Caipirinha de Limão',
        'Água de Coco Gelada',
      ],
      labels: {
        formatter: (value) => `${Math.round(Number(value))}`,
      },
    },
    yaxis: {
      labels: { maxWidth: 180 },
    },
    legend: { show: false },
    fill: { opacity: 1 },
  };
}
