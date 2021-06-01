import { Component } from '@angular/core';
import { parse, unparse } from 'papaparse';

export type DataRow = { [key: string]: string };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public fileName?: string;
  public transformedData?: string[][];

  constructor() {}

  public async onFileSelected(event: any) {
    const file = event?.target?.files?.[0];

    if (file) {
      const arr: string[][] = await new Promise((resolve) => {
        parse(file, {
          complete: (results) => resolve(results.data as string[][])
        });
      });
      const data: DataRow[] = this.arraysToDataRows(arr);

      this.transformedData = this.transformData(data);
      this.fileName = file.name;
    }

  }

  public onDownloadClick() {
    this.downloadCsv(unparse(this.transformedData!), this.fileName!);
  }

  private arraysToDataRows(arr: string[][]): DataRow[] {
    const headerCells = arr.shift() as string[];

    return arr.reduce(
      (acc: DataRow[], values: string[]) => [...acc, this.arrayToDataRow(headerCells, values)],
      [] as DataRow[]
    );
  }

  private arrayToDataRow(keys: string[], values: string[]): DataRow {
    return keys.reduce(
      (acc: DataRow, key: string, index: number) => Object.assign(acc, { [key]: values[index] }),
      {} as DataRow
    );
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
