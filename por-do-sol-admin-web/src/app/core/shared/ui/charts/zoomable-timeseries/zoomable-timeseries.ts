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
      "date": "2014-01-01",
      "value": 20000000
    },
    {
      "date": "2014-01-02",
      "value": 10379978
    },
    {
      "date": "2014-01-03",
      "value": 30493749
    },
    {
      "date": "2014-01-04",
      "value": 10785250
    },
    {
      "date": "2014-01-05",
      "value": 33901904
    },
    {
      "date": "2014-01-06",
      "value": 11576838
    },
    {
      "date": "2014-01-07",
      "value": 14413854
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
            return 'R$' + (val / 1000000).toFixed(0)
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
            return 'R$' + (val / 1000000).toFixed(0)
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
