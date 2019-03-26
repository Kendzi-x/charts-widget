import { Component, Input, OnChanges } from '@angular/core';
import * as Highcharts from 'highcharts';
import DarkUnicaTheme from 'highcharts/themes/dark-unica';
DarkUnicaTheme(Highcharts);
import { formatDate } from '../datepicker/datepicker.component';
import { sensorsData } from '../common/mock/data';

export interface ISeries {
  name: string;
  data?: number[];
  color?: string;
}

Highcharts.setOptions({
  title: {
    style: {
      color: 'tomato'
    }
  },
  legend: {
    enabled: false
  }
});

@Component({
  selector: 'app-highchart',
  templateUrl: './highchart.component.html',
  styleUrls: ['./highchart.component.scss']
})
export class HighchartComponent implements OnChanges {
  @Input()
  public dateRange: string[];

  public xs: string[] = [];

  public updateChart: boolean = false;
  public highcharts: typeof Highcharts = Highcharts;
  public chartOptions;

  /* Chart config */
  public currentType: string = 'line';
  public chartData: ISeries[] = [
    {
      name: 'temperature',
      data: sensorsData(8),
      color: '#2b908f'
    }
  ];

  public seriesTypes: { [key: string]: string } = {
    'line': 'bar',
    'bar': 'line'
  };

  // change Date format
  public formattedDate(date) {
    const d = date.split('.');

    const temp1 = d[0];
    d[0] = d[1];
    d[1] = temp1;
    return d;
  }

  public newDataOfSensors(dataOfSensors: number[]): number[] {
    const diff = this.xs.length - dataOfSensors.length;
    if (diff > 0) {
      dataOfSensors = dataOfSensors.concat(sensorsData(diff)); // add values for new larger period
    } else if (diff < 0) {
      dataOfSensors.splice(diff, Math.abs(diff)); // remove extra values
    }
    return dataOfSensors;
  }

  public ngOnChanges(): void {
    const arr = [],
      startDate = new Date(this.formattedDate(this.dateRange[0])),
      endDate = new Date(this.formattedDate(this.dateRange[1]));

    while (startDate <= endDate) {
      arr.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    this.xs = arr.map((date: Date) => formatDate(date)); // xAxis

    this.chartData.map((val: ISeries) => (val.data = this.newDataOfSensors(val.data)));

    /* Options */
    this.chartOptions = {
      title: { text: 'Sensors chart' },
      chart: {
        type: this.currentType // line | bar
      },
      xAxis: {
        type: 'datetime',
        categories: this.xs
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Value'
        },
        labels: {
          overflow: 'justify'
        }
      },
      series: this.chartData
    };

    this.updateChart = true;
  }

  public toggleSeriesType(): void {
    this.chartOptions.chart.type = this.seriesTypes[ this.chartOptions.chart.type || 'line' ] as 'line' | 'bar';
    this.currentType = this.chartOptions.chart.type;

    // nested change - must trigger update
    this.updateChart = true;
  }

  public toggleSeriesColor({ target }): void {
    const initialColors = [
      '#2b908f', '#90ee7e', '#f45b5b',
      '#7798BF', '#aaeeee', '#ff0066',
      '#eeaaee', '#55BF3B', '#DF5353',
      '#7798BF', '#aaeeee'
    ];
    if (target.text === 'default') {
      this.chartOptions.series.map(
        (val: ISeries, i) => (val.color = initialColors[i])
      );
    } else {
      this.chartOptions.series.map((val: ISeries) => (val.color = target.text));
    }

    this.updateChart = true;
  }

  public selectSensors({ target }): void {
    if (target.text === 'temperature') {
      this.chartData[0].name = 'temperature';
      this.chartData[0].color = '#2b908f';
    } else if (target.text === 'humidity')  {
      this.chartData[0].name = 'humidity';
      this.chartData[0].color = 'blue';
    } else {
      this.chartData[0].name = 'light';
      this.chartData[0].color = 'yellow';
    }

    this.chartData[0].data = sensorsData(this.xs.length);
    this.updateChart = true;
  }

  public combineSensors() {
    if (this.chartData.length < 3) {
      this.chartData.push( {
        name: '2nd temperature',
        data: sensorsData(this.xs.length)
      },
      {
        name: 'humidity',
        data: sensorsData(this.xs.length)
      });
    }

    this.updateChart = true;
  }
}
