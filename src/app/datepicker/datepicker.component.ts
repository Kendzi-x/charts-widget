import { Component, Output, EventEmitter, OnInit, HostListener, ViewChild } from '@angular/core';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

// change Date to dd.mm.yyyy format
export function formatDate(date): string {
  let dd = date.getDate();
  if (dd < 10) {
    dd = '0' + dd;
  }

  let mm = date.getMonth() + 1;
  if (mm < 10) {
    mm = '0' + mm;
  }

  let yy: any = date.getFullYear() % 100;
  if (yy < 10) {
    yy = '0' + yy;
  }

  return dd + '.' + mm + '.' + yy;
}


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatepickerComponent implements OnInit {
  model: Date[];
  dateList: String[];

  @Output() dateChange = new EventEmitter();

  @ViewChild(BsDaterangepickerDirective) datepicker: BsDaterangepickerDirective;
  @HostListener('window:scroll')
  public onScrollEvent(): void {
    this.datepicker.hide();
  }

  ngOnInit() {
    const week = new Date();
    week.setDate(week.getDate() + 7);
    this.model = [new Date(), week]; // initial state
    this.change();
  }

  public change(): void {
    this.dateList = this.model.map((date: Date) => formatDate(date));
    this.dateChange.emit(this.dateList);
  }
}

