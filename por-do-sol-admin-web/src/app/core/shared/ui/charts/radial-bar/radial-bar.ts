import { Component, Signal, computed, inject, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  // ApexStroke,
  // ApexFill,
  // ApexLegend,
  ApexTooltip,
  // ApexMarkers,
  ApexPlotOptions,
  // ApexResponsive,
  // ApexGrid,
  // ApexAnnotations,
  // ApexStates,
  // ApexTheme,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  title?: ApexTitleSubtitle;
  subtitle?: ApexTitleSubtitle;
  dataLabels?: ApexDataLabels;
  // stroke?: ApexStroke;
  // fill?: ApexFill;
  // legend?: ApexLegend;
  tooltip?: ApexTooltip;
  // markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  // responsive?: ApexResponsive[];
  // grid?: ApexGrid;
  // annotations?: ApexAnnotations;
  // states?: ApexStates;
  // theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

import { StatisticsService } from '../../../../services/statistics-service';

@Component({
  selector: 'app-radial-bar',
  imports: [NgApexchartsModule],
  templateUrl: './radial-bar.html',
  styleUrl: './radial-bar.css',
})
export class RadialBar {

  @ViewChild('chart') chart!: ChartComponent;
  private readonly statisticsService = inject(StatisticsService)
  public chartOptions!: Signal<ChartOptions>

  constructor() {
    this.chartOptions = computed((): ChartOptions => {
      const cancellations = this.statisticsService.statistics()?.cancellations
      return {
      series: [Math.round((cancellations?.rate ?? 0) * 10) / 10],
      chart: {
        height: 350,
        type: 'radialBar',
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        }
      },
      colors: [
        '#D95825',
        '#632004',
      ],
      title: {
        text: 'Taxa de cancelamentos',
        align: 'left',
        style: {
          color: "var(--color-outline)",
          // fontWeight: "bold",
          // fontSize: "0.8rem",
          fontWeight: "semibold",
          fontFamily: "var(--font-poppins)"
        }
      },
      subtitle: {
        text: 'Cancelados e rejeitados sobre os pedidos concluídos dos últimos 7 dias',
        align: 'left',
        style: {
          color: "var(--color-sub-text)",
          // fontWeight: "bold",
          fontSize: "0.8rem",
          fontFamily: "var(--font-poppins)"
        }
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
              formatter: (value) => `${value}%`,
            },
            total: {
              show: true,
              label: 'Cancelados',
              formatter: () => `${cancellations?.cancelledOrders ?? 0} de ${cancellations?.totalOrders ?? 0}`,
            },
          },
        },
      },
      labels: ['Cancelamentos'],
    };
    });
  }
}
