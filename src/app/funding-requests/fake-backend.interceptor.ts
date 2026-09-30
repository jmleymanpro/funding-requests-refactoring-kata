// DO NOT MODIFY: simulates the REST API with network latency.
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { FundingRequest, Institution } from './funding-request.model';

const institutions: Institution[] = [
  { id: 1, name: 'University of Mons', type: 'UNIVERSITY' },
  { id: 2, name: 'BioTech Wallonia Ltd', type: 'SME' },
  { id: 3, name: 'Health Network NPO', type: 'NON_PROFIT' }
];

let requests: FundingRequest[] = [
  { id: 1, title: 'Low-cost air quality sensors', type: 'RESEARCH', requestedBudget: 120000,
    deadline: '2026-06-30', submissionDate: '2026-06-12', waiver: false, institution: institutions[0] },
  { id: 2, title: 'Sequencing platform', type: 'INFRA', requestedBudget: 900000,
    deadline: '2026-06-30', submissionDate: '2026-06-28', waiver: false, institution: institutions[0] },
  { id: 3, title: 'Biosensor prototype', type: 'DEVELOPMENT', requestedBudget: 80000,
    deadline: '2026-05-31', submissionDate: '2026-05-20', waiver: false, institution: institutions[1] },
  { id: 4, title: 'Shared clean room', type: 'INFRA', requestedBudget: 600000,
    deadline: '2026-05-31', submissionDate: '2026-05-31', waiver: false, institution: institutions[1] },
  { id: 5, title: 'Regional epidemiological study', type: 'RESEARCH', requestedBudget: 200000,
    deadline: '2026-04-30', submissionDate: '2026-05-04', waiver: true, institution: institutions[2] },
  { id: 6, title: 'Awareness workshop', type: 'DEVELOPMENT', requestedBudget: 8000,
    deadline: '2026-04-30', submissionDate: '2026-04-10', waiver: false, institution: institutions[2] },
  { id: 7, title: 'Clinical trials registry', type: 'DEVELOPMENT', requestedBudget: 150000,
    deadline: '2026-03-31', submissionDate: '2026-04-02', waiver: true, institution: institutions[2] }
];

const LATENCY_MS = 400;

export const fakeBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const url = req.url;

  if (req.method === 'GET' && url === '/api/institutions') {
    return of(new HttpResponse({ status: 200, body: institutions })).pipe(delay(LATENCY_MS));
  }

  if (req.method === 'GET' && url === '/api/funding-requests') {
    return of(new HttpResponse({ status: 200, body: requests })).pipe(delay(LATENCY_MS));
  }

  const byInstitution = url.match(/^\/api\/institutions\/(\d+)\/funding-requests$/);
  if (req.method === 'GET' && byInstitution) {
    const id = Number(byInstitution[1]);
    const body = requests.filter(r => r.institution.id === id);
    return of(new HttpResponse({ status: 200, body })).pipe(delay(LATENCY_MS));
  }

  const put = url.match(/^\/api\/funding-requests\/(\d+)$/);
  if (req.method === 'PUT' && put) {
    const id = Number(put[1]);
    const update = req.body as FundingRequest;
    requests = requests.map(r => (r.id === id ? { ...r, ...update, id } : r));
    return of(new HttpResponse({ status: 200, body: requests.find(r => r.id === id) })).pipe(delay(LATENCY_MS));
  }

  return next(req);
};
