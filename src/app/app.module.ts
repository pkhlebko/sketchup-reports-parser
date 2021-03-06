import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { DataTabsComponent } from './components/data-tabs/data-tabs.component';
import { DocumentationComponent } from './components/documentation/documentation.component';
import { ToolComponent } from './components/tool/tool.component';

const appRoutes: Routes = [
  { path: '',   redirectTo: '/tool', pathMatch: 'full' },
  { path: 'tool', component: ToolComponent },
  { path: 'documentation', component: DocumentationComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    DataTableComponent,
    DataTabsComponent,
    DocumentationComponent,
    ToolComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
