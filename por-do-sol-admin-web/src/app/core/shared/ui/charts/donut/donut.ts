import { Component, ViewChild } from '@angular/core';
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
  // ApexTooltip,
  // ApexMarkers,
  ApexPlotOptions,
  ApexResponsive,
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
  // tooltip?: ApexTooltip;
  // markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  // grid?: ApexGrid;
  // annotations?: ApexAnnotations;
  // states?: ApexStates;
  theme?: ApexTheme;
  colors?: string[];
  labels?: any;
};

@Component({
  selector: 'app-donut',
  imports: [NgApexchartsModule],
  templateUrl: './donut.html',
  styleUrl: './donut.css',
})
export class Donut {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions
  constructor() {
    this.chartOptions = {
      series: [128, 96, 74, 52, 38],
      chart: {
        type: 'donut',
        width: '100%',
        height: '350'
      },
      theme: {
        mode: 'light',
        palette: 'palette1'
      },

      colors: [
        '#E8754A',
        '#D95825',
        '#C0420A',
        '#A63708',
        '#852C06',
        '#632004',
        '#3D1302'
      ],
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 270,
          // customScale: 1.25,
          offsetY: 20,
          donut: {
            size: '70%'
          }
        },
      },
      labels: ['Compute', 'Storage', 'Database', 'Networking', 'Analytics'],
      dataLabels: {
        enabled: false,
      },
      // fill: {
      //   type: 'gradient',
      // },
      legend: {
        formatter: (val, opts) => {
          return val + ' - $' + opts.w.globals.series[opts.seriesIndex] + 'k'
        },
        position: 'bottom',
      },
      title: {
        text: 'Vendas por categoria',
        style: {
          color: "var(--color-outline)",
          // fontWeight: "bold",
          // fontSize: "0.8rem",
          fontWeight: "semibold",
          fontFamily: "var(--font-poppins)"
        }
      },
      subtitle: {
        text: "Participação nos pedidos da semana",
        align: 'left',
        style: {
          color: "var(--color-sub-text)",
          // fontWeight: "bold",
          fontSize: "0.8rem",
          fontFamily: "var(--font-poppins)"
        }
      },
      responsive: [
        {
          breakpoint: 1213,
          options: {
            chart: {
              type: 'donut',
              width: '60%',
              height: 300
            },
            legend: {
              position: 'bottom',
              // width: 200
            }
          }
        },
        {
          breakpoint: 1020,
          options: {
            chart: {
              type: 'donut',
              width: '100%',
              height: 350
            },
            legend: {
              position: 'bottom',
              // width: 200
            }
          }
        },
        {
          breakpoint: 450,
          options: {
            chart: {
              type: 'donut',
              width: '100%',
              height: 350
            },
            legend: {
              position: 'bottom',
              // width: 200
            }
          }
        }
      ]
    };
  }
}
