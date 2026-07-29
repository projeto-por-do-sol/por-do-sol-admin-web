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
  selector: 'app-stacked-column',
  imports: [NgApexchartsModule],
  templateUrl: './stacked-column.html',
  styleUrl: './stacked-column.css',
})
export class StackedColumn {

  @ViewChild('chart') chart!: ChartComponent;
  public chartOptions!: ChartOptions;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Phones',
          data: [44, 55, 41, 67, 22, 43],
        },
        {
          name: 'Tablets',
          data: [13, 23, 20, 8, 13, 27],
        },
        {
          name: 'Laptops',
          data: [11, 17, 15, 15, 21, 14],
        },
        {
          name: 'Wearables',
          data: [21, 7, 25, 13, 22, 8],
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },

      theme: {
        mode: 'dark',
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
          borderRadiusApplication: 'end', // 'around', 'end'
          borderRadiusWhenStacked: 'last', // 'all', 'last'
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
        text: 'Pedidos dos quiosques por dia',
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
        text: 'Últimos 7 dias',
        align: 'left',
        style: {
          color: "var(--color-sub-text)",
          // fontWeight: "bold",
          fontSize: "0.8rem",
          fontFamily: "var(--font-poppins)"
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      yaxis: {
        labels: {
          formatter: (val) => {
            return 'R$' + val + 'k'
          },
        },
      },
      legend: {
        position: 'right',
        offsetY: 40,
        fontFamily: 'var(--font-poppins)',
        fontWeight: "semibold",
        fontSize: "0.8rem"
      },
      fill: {
        opacity: 1,
      },
    }
  }
}