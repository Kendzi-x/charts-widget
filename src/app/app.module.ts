import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';

import { DatepickerComponent } from './datepicker/datepicker.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { HighchartComponent } from './highchart/highchart.component';

@NgModule({
  declarations: [AppComponent, DatepickerComponent, HighchartComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HighchartsChartModule,
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
