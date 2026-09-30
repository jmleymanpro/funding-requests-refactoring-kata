import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { FundingRequest, Institution } from './funding-request.model';

@Injectable({ providedIn: 'root' })
export class FundingRequestService {
  private requestsSubject = new BehaviorSubject<FundingRequest[]>([]);
  requests$ = this.requestsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getInstitutions(): Observable<Institution[]> {
    return this.http.get<Institution[]>('/api/institutions');
  }

  load(institutionId: number | null): Observable<FundingRequest[]> {
    const url = institutionId
      ? `/api/institutions/${institutionId}/funding-requests`
      : '/api/funding-requests';
    return this.http.get<FundingRequest[]>(url).pipe(
      tap(requests => this.requestsSubject.next(requests))
    );
  }

  save(request: any): Observable<any> {
    return this.http.put(`/api/funding-requests/${request.id}`, request);
  }
}
