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
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexNoData,
  // ApexGrid,
  // ApexAnnotations,
  // ApexStates,
  ApexTheme,
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
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  // grid?: ApexGrid;
  // annotations?: ApexAnnotations;
  // states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
  noData?: ApexNoData;
};

import { StatisticsService } from '../../../../services/statistics-service';

@Component({
  selector: 'app-zoomable-timeseries',
  imports: [NgApexchartsModule],
  templateUrl: './zoomable-timeseries.html',
  styleUrl: './zoomable-timeseries.css',
})
export class ZoomableTimeseries {

  @ViewChild('chart') chart!: ChartComponent;
  private readonly statisticsService = inject(StatisticsService)
  public chartOptions!: Signal<ChartOptions>

  constructor() {
    this.chartOptions = computed((): ChartOptions => {
      const points = this.statisticsService.statistics()?.dailyRevenue.points ?? []
      return {
      series: [
        {
          name: 'Faturamento Total',
          data: points.map(point => [new Date(point.date).getTime(), Math.round((point.value + Number.EPSILON) * 100) / 100]) as any,
          color: '#C0420a'
        },
      ],
      chart: {
        type: 'area',
        stacked: false,
        height: 350,
        zoom: {
          type: 'x',
          enabled: true,
          autoScaleYaxis: true,
        },
        toolbar: {
          autoSelected: 'zoom',
        },
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      title: {
        text: 'Faturamento · 7 dias',
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
        text: 'Tendência diária, em reais',
        align: 'left',
        style: {
          color: "var(--color-sub-text)",
          // fontWeight: "bold",
          fontSize: "0.8rem",
          fontFamily: "var(--font-poppins)"
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.7,
          opacityTo: 0.5,
          stops: [0, 90, 100],
        },
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              maximumFractionDigits: 0,
            }).format(val)
          },
        },
        title: {
          text: 'Valor',
          style: {
            fontSize: "0.8rem"
          }
        },
      },
      xaxis: {
        type: 'datetime',
      },
      noData: { text: 'Sem faturamento no período' },
      tooltip: {
        shared: false,
        y: {
          formatter: (val) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(val)
          },
        },
      },
    };
    });
  }

}
