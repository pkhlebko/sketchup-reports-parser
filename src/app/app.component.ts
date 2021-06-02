import { Component } from '@angular/core';
import { CsvParserService, DataRow } from './services/csv-parser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public fileName?: string;
  public transformedData?: string[][];

  constructor(private csvParser: CsvParserService) {}

  public async onFileSelected(event: any) {
    const file = event?.target?.files?.[0];

    if (file) {
      const data: DataRow[] = await this.csvParser.getCsvDataRowsFromFile(file);

      this.transformedData = this.transformData(data);
      this.fileName = file.name;
    }
  }

  public onDownloadClick() {
    const csvDataSting = this.csvParser.csvDataToString(this.transformedData!);
    this.downloadCsv(csvDataSting, this.fileName!);
  }

  private transformData(data: DataRow[]): string[][] {
    const definitionExp = /^(.+) (\d+)x(\d+) ([0-1]{4})(.*)$/;
    const headerRow = [
      'Name',
      'Material',
      'X',
      'Y',
      'Quantity',
      'X1B',
      'X2B',
      'Y1B',
      'Y2B',
      'Comment'
    ];
    const itemConverter = (item: DataRow) => {
      const match = item['Definition Name'].match(definitionExp);

      if (!match) {
        return null;
      }

      return [
        match[1],
        '',
        match[2],
        match[3],
        item['Quantity'],
        match[4].charAt(0),
        match[4].charAt(1),
        match[4].charAt(2),
        match[4].charAt(3),
        match[5]
      ];
    }
    // @ts-ignore
    return [headerRow].concat(data.map(itemConverter).filter(item => item));
  }

  private downloadCsv(data: string, filename: string) {
    const type = 'text/csv;charset=utf-8;';
    const file = new Blob([data], { type });

    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, filename);
    else {
      const a = document.createElement('a'),

      url = URL.createObjectURL(file);
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
}
