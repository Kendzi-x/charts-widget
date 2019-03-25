import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isShown: boolean = true;
  public numberOfCharts: number = 1;
  public dateRange: string[];
}
