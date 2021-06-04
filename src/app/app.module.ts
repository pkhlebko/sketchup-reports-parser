import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTabsComponent } from './components/data-tabs/data-tabs.component';

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    DataTabsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
