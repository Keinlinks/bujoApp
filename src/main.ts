import { importProvidersFrom } from '@angular/core';
import { AppComponent } from './app/app.component';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
const dbConfig: DBConfig = {
  name: 'objetiveDb',
  version: 1,
  objectStoresMeta: [
    {
      store: 'objectives',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: false } },
      ],
    },
  ],
};

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(
      BrowserModule,
      NgxIndexedDBModule.forRoot({ ...dbConfig })
    ),
  ],
}).catch((err) => console.error(err));

//indexDb
