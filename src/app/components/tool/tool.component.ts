import { Component } from '@angular/core';
import { CsvData, CsvParserService } from '../../services/csv-parser.service';
import { DataConverterService } from '../../services/data-converter.service';

@Component({
  selector: 'app-tool',
  templateUrl: './tool.component.html',
  styleUrls: ['./tool.component.scss']
})
export class ToolComponent {

  public fileName?: string;
  public csvData?: CsvData;
  public transformedData?: CsvData;
  public readonly converterPresets: string[];
  public selectedPreset: string;

  constructor(
    private csvParser: CsvParserService,
    private dataCoverter: DataConverterService
  ) {
    this.converterPresets = Object.keys(this.dataCoverter.availablePresets);
    this.selectedPreset = this.converterPresets[0];
  }

  public async onFileSelected(event: any) {
    const file = event?.target?.files?.[0];

    if (file) {
      this.fileName = file.name;
      this.csvData = await this.csvParser.getCsvDataFromFile(file);
    }
  }

  public setSelectedPreset(event: any) {
    this.selectedPreset = event?.target?.value as string;
  }

  public onTransformClick() {
    const converterConfig = this.dataCoverter.availablePresets[this.selectedPreset];

    this.transformedData = this.dataCoverter.transformData(
      this.csvParser.getCsvDataRows(this.csvData!),
      converterConfig
    );
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
