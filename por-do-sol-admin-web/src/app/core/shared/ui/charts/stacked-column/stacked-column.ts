import { Component, computed, inject, ViewChild } from '@angular/core';
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
  ApexTooltip,
  ApexPlotOptions,
  ApexResponsive,
  ApexTheme,
  ApexNoData,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { KioskSelectionService } from '../../../../services/kiosk-selection-service';
import { PermissionService } from '../../../../services/permission-service';
import { StatisticsService } from '../../../../services/statistics-service';

import { StatisticsResponse } from '../../../../models/statistics-model';

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
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
  noData?: ApexNoData;
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
  private readonly permissionService = inject(PermissionService);
  private readonly statisticsService = inject(StatisticsService);

  // Com um quiosque em foco (selecionado, ou o único do gerente) mostra os produtos; senão, o faturamento por quiosque.
  readonly chartOptions = computed((): ChartOptions => {
    const statistics = this.statisticsService.statistics();
    return this.selectionService.selectedKiosk() || !this.permissionService.isOwner()
      ? this.productChartOptions(statistics?.topProducts.products ?? [])
      : this.companyChartOptions(statistics?.revenueByKiosk);
  });

  private companyChartOptions(revenue?: StatisticsResponse['revenueByKiosk']): ChartOptions {
    return {
    series: (revenue?.kiosks ?? []).map(kiosk => ({ name: kiosk.kioskName, data: kiosk.revenue.map(value => this.round2(value)) })),
    noData: { text: 'Sem faturamento no período' },
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
            formatter: (value) => this.currency(Number(value)),
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
      categories: (revenue?.dates ?? []).map(date => this.weekday(date)),
    },
    yaxis: {
      labels: {
        formatter: (value) => new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          notation: 'compact',
          maximumFractionDigits: 2,
        }).format(value),
      },
    },
    tooltip: {
      y: { formatter: (value) => this.currency(value) },
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
  }

  private productChartOptions(products: StatisticsResponse['topProducts']['products']): ChartOptions {
    return {
    series: [
      {
        name: 'Unidades vendidas',
        data: products.map(product => product.unitsSold),
      },
    ],
    noData: { text: 'Sem vendas no período' },
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
      categories: products.map(product => product.productName),
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

  private round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  // Valores monetários com no máximo 2 casas decimais.
  private currency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    }).format(this.round2(value));
  }

  // A API devolve datas ISO (AAAA-MM-DD); montadas como data local para não recuar um dia pelo fuso.
  private weekday(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
  }
}
