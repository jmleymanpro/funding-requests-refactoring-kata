import { Component } from '@angular/core';
import { FundingRequestsPageComponent } from './funding-requests/funding-requests-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FundingRequestsPageComponent],
  template: `<app-funding-requests-page />`
})
export class App {}
