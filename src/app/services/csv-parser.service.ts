import { Injectable } from '@angular/core';
import { parse, unparse } from 'papaparse';

export type CsvData = string[][];
export type DataRow = { [key: string]: string };

@Injectable({
  providedIn: 'root'
})
export class CsvParserService {

  constructor() { }

  public getCsvDataFromFile(file: File): Promise<CsvData> {
    return new Promise((resolve) => {
      parse(file, {
        complete: (results) => resolve(results.data as CsvData)
      });
    });
  }

  public getCsvDataRows(csvData: CsvData) {
    return this.arraysToDataRows(csvData);
  }

  public csvDataToString(data: CsvData): string {
    return unparse(data);
  }

  private arraysToDataRows(arr: CsvData): DataRow[] {
    arr = [...arr];

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
}
