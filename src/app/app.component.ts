import { Component } from '@angular/core';
import { CsvParserService, DataRow } from './services/csv-parser.service';
import { DataConverterService } from './services/data-converter.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  public fileName?: string;
  public transformedData?: string[][];

  constructor(
    private csvParser: CsvParserService,
    private dataCoverter: DataConverterService
  ) { }

  public async onFileSelected(event: any) {
    const file = event?.target?.files?.[0];

    if (file) {
      const data = await this.csvParser.getCsvDataRowsFromFile(file);

      this.fileName = file.name;
      this.transformedData = this.dataCoverter.transformData(data);
    }
  }

  public onDownloadClick() {
    const csvDataSting = this.csvParser.csvDataToString(this.transformedData!);

    this.downloadCsv(csvDataSting, this.fileName!);
  }

  private downloadCsv(data: string, fileName: string) {
    const type = 'text/csv;charset=utf-8;';
    const file = new Blob([data], { type });

    if (window.navigator.msSaveOrOpenBlob)
      window.navigator.msSaveOrOpenBlob(file, fileName);
    else {
      const a = document.createElement('a'),

        url = URL.createObjectURL(file);
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 0);
    }
  }
}
