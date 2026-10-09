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
  ApexTooltip,
  ApexMarkers,
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
};

@Component({
  selector: 'app-zoomable-timeseries',
  imports: [NgApexchartsModule],
  templateUrl: './zoomable-timeseries.html',
  styleUrl: './zoomable-timeseries.css',
})
export class ZoomableTimeseries {

  @ViewChild('chart') chart!: ChartComponent;
  private dataSeries: any = [
    {
      "date": "2026-10-03T12:00:00",
      "value": 5540
    },
    {
      "date": "2026-10-04T12:00:00",
      "value": 6120
    },
    {
      "date": "2026-10-05T12:00:00",
      "value": 4860
    },
    {
      "date": "2026-10-06T12:00:00",
      "value": 5390
    },
    {
      "date": "2026-10-07T12:00:00",
      "value": 6480
    },
    {
      "date": "2026-10-08T12:00:00",
      "value": 7310
    },
    {
      "date": "2026-10-09T12:00:00",
      "value": 6890
    },
  ]

  // private ts2: any = new Date('14 Jan 2025').getTime();

  private dates: any = [];
  public chartOptions!: ChartOptions

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Faturamento Total',
          data: this.dates,
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
      tooltip: {
        shared: false,
        y: {
          formatter: (val) => {
            return new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(val)
          },
        },
      },
    };
  }

  ngAfterViewInit() {
    this.dataSeries.forEach((item: { date: string | number | Date; value: any; }) => {
      this.dates.push([
        new Date(item.date).getTime(),
        item.value
      ]);
    });

    this.chart?.updateSeries([
      {
        name: 'Faturamento Total',
        data: this.dates
      }
    ]);
  }

}
