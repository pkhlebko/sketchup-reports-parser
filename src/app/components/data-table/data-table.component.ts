import { Component, Input, OnInit } from '@angular/core';
import { CsvData } from 'src/app/services/csv-parser.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html'
})
export class DataTableComponent implements OnInit {
  @Input() data?: CsvData;
  @Input() title?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
