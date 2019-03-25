import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import DarkUnicaTheme from 'highcharts/themes/dark-unica';
DarkUnicaTheme(Highcharts);
import { formatDate } from '../datepicker/datepicker.component';
import { sensorsData } from '../common/mock/data';

export interface ISeries {
  name: string;
  data: number[];
  color: string;
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

  public currentType: string = 'line';

  public dataOfSensors: number[] = sensorsData(8);

  seriesTypes: { [key: string]: string } = {
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

  public ngOnChanges(): void {
    const arr = [],
      startDate = new Date(this.formattedDate(this.dateRange[0])),
      endDate = new Date(this.formattedDate(this.dateRange[1]));

    while (startDate <= endDate) {
      arr.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }

    this.xs = arr.map((date: Date) => formatDate(date));

    const diff = this.xs.length - this.dataOfSensors.length;
    if (diff > 0) {
      this.dataOfSensors = this.dataOfSensors.concat(sensorsData(diff)); // add values for new larger period
    } else {
      this.dataOfSensors = sensorsData(this.xs.length);
    }

    /* Options */
    this.chartOptions = {
      chart: {
        type: this.currentType
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
      series: [
        {
          name: 'temperature',
          data: this.dataOfSensors,
          color: '#2b908f'
        }
      ]
    };

    this.updateChart = true;
  }

  public toggleSeriesType(): void {
    this.chartOptions.chart.type = this.seriesTypes[ this.chartOptions.chart.type || 'line' ] as 'line' | 'bar';
    console.log(this.chartOptions.chart.type);

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
      console.log('temperature');
      this.chartOptions.series.map((val: ISeries) => {
        val.color = '#2b908f';
        val.name = 'temperature';
      });
    } else if (target.text === 'humidity')  {
      console.log('humidity');
      this.chartOptions.series.map((val: ISeries) => {
        val.color = 'blue';
        val.name = 'humidity';
      });
    } else {
      console.log('light');
      this.chartOptions.series.map((val: ISeries) => {
        val.color = 'yellow';
        val.name = 'light';
      });
    }

    this.chartOptions.series.map((val: ISeries) => (val.data = sensorsData(this.xs.length)));
    this.updateChart = true;
  }
}
