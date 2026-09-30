import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FundingRequestService } from './funding-request.service';
import { FundingRequest } from './funding-request.model';

@Component({
  selector: 'app-funding-requests-page',
  standalone: true,
  imports: [CurrencyPipe, FormsModule, ReactiveFormsModule],
  // Added automatically by the Angular 22 migration to keep the previous behaviour.
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <h1>Funding requests</h1>

    <div class="filters">
      <input placeholder="Filter by title"
             [(ngModel)]="filter"
             (ngModelChange)="onFilterChange()">

      <select [(ngModel)]="institutionId" (change)="onInstitutionChange()">
        <option [ngValue]="null">All institutions</option>
        @for (i of institutions; track $index) {
          <option [ngValue]="i.id">{{ i.name }}</option>
        }
      </select>
    </div>

    @if (isLoading) { <p>Loading…</p> }
    @if (error) { <p class="error">{{ error }}</p> }

    <table>
      <tr><th>Title</th><th>Type</th><th>Institution</th><th>Budget</th><th>Grant</th></tr>
      @for (r of filteredRequests; track $index) {
        <tr (click)="select(r)" [class.selected]="selected?.id === r.id">
          <td>{{ r.title }}</td>
          <td>{{ r.type }}</td>
          <td>{{ r.institution.name }}</td>
          <td>{{ r.requestedBudget | currency:'EUR' }}</td>
          <td>{{ grant(r) | currency:'EUR' }}</td>
        </tr>
      }
    </table>

    <p><strong>Total grants displayed:</strong> {{ totalGrants | currency:'EUR' }}</p>

    @if (selected) {
      <form [formGroup]="form" (ngSubmit)="save()">
        <h2>Edit “{{ selected.title }}”</h2>
        <label>Title <input formControlName="title"></label>
        <label>Requested budget <input type="number" formControlName="requestedBudget"></label>
        <label>Type
          <select formControlName="type">
            <option value="RESEARCH">Research</option>
            <option value="DEVELOPMENT">Development</option>
            <option value="INFRA">Infrastructure</option>
          </select>
        </label>
        <label><input type="checkbox" formControlName="waiver"> Waiver</label>
        <button type="submit" [disabled]="form.invalid || isSaving">Save</button>
        @if (form.get('requestedBudget')?.errors?.['min']) { <small>The budget must be positive</small> }
      </form>
    }
  `
})
export class FundingRequestsPageComponent implements OnInit {
  institutions: any[] = [];
  requests: FundingRequest[] = [];
  filter = '';
  institutionId: number | null = null;
  isLoading = false;
  isSaving = false;
  error: string | null = null;
  selected: FundingRequest | null = null;
  form: FormGroup;

  constructor(
    private service: FundingRequestService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      requestedBudget: [0, [Validators.required, Validators.min(0)]],
      type: ['RESEARCH'],
      waiver: [false]
    });
  }

  ngOnInit() {
    this.service.getInstitutions().subscribe(institutions => {
      this.institutions = institutions;
    });

    this.route.queryParams.subscribe(params => {
      if (params['institution']) {
        this.institutionId = +params['institution'];
        this.load();
      }
    });

    this.service.requests$.subscribe(requests => {
      this.requests = requests;
    });

    this.load();
  }

  onFilterChange() {
    this.load();
  }

  onInstitutionChange() {
    this.load();
  }

  load() {
    this.isLoading = true;
    this.error = null;
    this.service.load(this.institutionId).subscribe({
      next: () => { this.isLoading = false; },
      error: (e: any) => { this.error = e.message; this.isLoading = false; }
    });
  }

  get filteredRequests(): FundingRequest[] {
    return this.requests.filter(r =>
      r.title.toLowerCase().includes(this.filter.toLowerCase())
    );
  }

  get totalGrants(): number {
    let total = 0;
    for (const r of this.filteredRequests) {
      total = total + this.grant(r);
    }
    return total;
  }

  grant(r: any): number {
    let rate = 60;
    let cap = 250000;
    if (r.requestedBudget < 10000) {
      return 0;
    }
    if (r.institution.type == 'SME') {
      rate = 70;
    }
    if (r.institution.type == 'UNIVERSITY') {
      rate = 80;
    }
    if (r.type == 'INFRA') {
      cap = 500000;
      if (r.institution.type == 'SME') {
        rate = rate - 10;
      }
    }
    if (new Date(r.submissionDate) > new Date(r.deadline)) {
      if (r.type == 'RESEARCH' && r.waiver == true) {
        rate = rate - 10;
      } else {
        return 0;
      }
    }
    let amount = r.requestedBudget * rate / 100;
    if (amount > cap) {
      amount = cap;
    }
    return Math.round(amount);
  }

  select(r: FundingRequest) {
    this.selected = r;
    this.form.patchValue(r);
  }

  save() {
    if (this.form.invalid || !this.selected) {
      return;
    }
    this.isSaving = true;
    const updated = { ...this.selected, ...this.form.value };
    this.service.save(updated).subscribe(() => {
      this.isSaving = false;
      this.selected = null;
      this.load();
    });
  }
}
