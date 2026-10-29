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
  // ApexMarkers,
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
  // markers?: ApexMarkers;
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
  selector: 'app-donut',
  imports: [NgApexchartsModule],
  templateUrl: './donut.html',
  styleUrl: './donut.css',
})
export class Donut {

  @ViewChild('chart') chart!: ChartComponent;
  private readonly statisticsService = inject(StatisticsService)
  public chartOptions!: Signal<ChartOptions>
  constructor() {
    this.chartOptions = computed((): ChartOptions => {
      const categories = this.statisticsService.statistics()?.ordersByCategory.categories ?? []
      return {
      series: categories.map(category => category.orderCount),
      chart: {
        type: 'donut',
        width: '100%',
        height: '350',
        toolbar: {
          show: true,
          tools: {
            download: true,
          }
        }
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
      labels: categories.map(category => category.categoryName),
      noData: { text: 'Sem pedidos no período' },
      dataLabels: {
        enabled: false,
      },
      // fill: {
      //   type: 'gradient',
      // },
      legend: {
        formatter: (val, opts) => {
          return val + ' · ' + opts.w.globals.series[opts.seriesIndex] + ' pedidos'
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
              width: '100%',
              height: 300
            },
            legend: {
              position: 'bottom',
              // width: 200
            }
          }
        },
        // {
        //   breakpoint: 1020,
        //   options: {
        //     chart: {
        //       type: 'donut',
        //       width: '100%',
        //       height: 350
        //     },
        //     legend: {
        //       position: 'bottom',
        //       // width: 200
        //     }
        //   }
        // },
        // {
        //   breakpoint: 450,
        //   options: {
        //     chart: {
        //       type: 'donut',
        //       width: '100%',
        //       height: 350
        //     },
        //     legend: {
        //       position: 'bottom',
        //       // width: 200
        //     }
        //   }
        // }
      ]
    };
    });
  }
}
