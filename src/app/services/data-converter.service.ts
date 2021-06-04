import { Injectable } from '@angular/core';
import { type } from 'os';
import { CsvData, DataRow } from './csv-parser.service';

export type ConverterConfig = {
    matcher: RegExp,
    template: { title: string, source: string }[]
};

@Injectable({
  providedIn: 'root'
})
export class DataConverterService {

  private readonly matchColumn = 'Definition Name';
  private readonly presets: {[key: string]: ConverterConfig} = {
    'Furniture': {
      matcher: /^(.+) (\d+)[x\*](\d+) ([0-1]{4})(.*)$/,
      template: [
        { title: 'Name', source: 'm1' },
        { title: 'X', source: 'm2' },
        { title: 'Y', source: 'm3' },
        { title: 'Quantity', source: 'Quantity' },
        { title: 'X1B', source: 'm4c0' },
        { title: 'X2B', source: 'm4c1' },
        { title: 'Y1B', source: 'm4c2' },
        { title: 'Y2B', source: 'm4c3' },
        { title: 'Comment', source: 'm5' }
      ]
    },
    'Frame building': {
      matcher: /^(.+) (\d+)(?:[x\*](\d+))*(.*)$/,
      template: [
        { title: 'Material', source: 'm1' },
        { title: 'Length', source: 'm2' },
        { title: 'Width', source: 'm3' },
        { title: 'Quantity', source: 'Quantity' },
        { title: 'Comment', source: 'm4' }
      ]
    }
  };

  public get availablePresets() {
    return this.presets;
  }

  constructor() { }

  public transformData(data: DataRow[], config: ConverterConfig): CsvData {
    const itemConverter = (item: DataRow, rowIndex: number) => {
      const match = item[this.matchColumn].match(config.matcher);

      if (!match) {
        return null;
      }

      return config.template.map(cell => this.getCellValue(
        cell.source,
        match,
        data[rowIndex]
      ));
    }
    const headerRow = config.template.map(cell => cell.title);



    // @ts-ignore
    return [headerRow].concat(data.map(itemConverter).filter(item => item));
  }

  private getCellValue(souce: string, matches: RegExpMatchArray, row: DataRow) {
    const result = /^m(\d+)(?:c(\d+))?$/.exec(souce);

    if (result === null) {
      return row[souce];
    } else {
      const matchNumber = result[1];
      const charNumber = result[2];

      return charNumber ? matches[parseInt(matchNumber)].charAt(parseInt(charNumber)) : matches[parseInt(matchNumber)];
    }
  }
}
