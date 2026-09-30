import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { fakeBackendInterceptor } from './funding-requests/fake-backend.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // The application still relies on zone.js: its state is made of plain properties
    // mutated inside asynchronous callbacks.
    provideZoneChangeDetection(),
    provideRouter([]),
    provideHttpClient(withInterceptors([fakeBackendInterceptor]))
  ]
};
