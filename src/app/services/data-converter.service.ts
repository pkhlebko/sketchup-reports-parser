import { Injectable } from '@angular/core';
import { DataRow } from './csv-parser.service';

@Injectable({
  providedIn: 'root'
})
export class DataConverterService {

  constructor() { }

  public transformData(data: DataRow[]): string[][] {
    const definitionExp = /^(.+) (\d+)x(\d+) ([0-1]{4})(.*)$/;
    const headerRow = [
      'Name',
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
}
