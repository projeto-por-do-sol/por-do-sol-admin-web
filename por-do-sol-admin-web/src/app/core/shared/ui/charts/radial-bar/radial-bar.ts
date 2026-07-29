import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexStroke,
  ApexFill,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexAnnotations,
  ApexStates,
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
  stroke?: ApexStroke;
  fill?: ApexFill;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  annotations?: ApexAnnotations;
  states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-radial-bar',
  imports: [NgApexchartsModule],
  templateUrl: './radial-bar.html',
  styleUrl: './radial-bar.css',
})
export class RadialBar {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions

  constructor() {
    this.chartOptions = {
      series: [68, 82],
      chart: {
        height: 350,
        type: 'radialBar',
      },
      colors: [
        '#D95825',
        '#632004',
      ],
      title: {
        text: 'Taxa de cancelamentos e atrasos',
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
        text: 'Pedidos cancelados/atrasados',
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
            },
            total: {
              show: true,
              label: 'Média',
              formatter: (w) => {
                // custom formatter: rounded average across all series, with a unit
                var total = w.globals.seriesTotals.reduce(function (a: any, b: any) {
                  return a + b
                }, 0)
                return Math.round(total / w.globals.series.length) + '%'
              },
            },
          },
        },
      },
      labels: ['Cancelamentos', 'Atrasos'],
    };
  }
}
