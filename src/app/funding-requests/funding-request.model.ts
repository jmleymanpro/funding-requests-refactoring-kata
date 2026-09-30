export type RequestType = 'RESEARCH' | 'DEVELOPMENT' | 'INFRA';
export type InstitutionType = 'UNIVERSITY' | 'SME' | 'NON_PROFIT';

export interface Institution {
  id: number;
  name: string;
  type: InstitutionType;
}

export interface FundingRequest {
  id: number;
  title: string;
  type: RequestType;
  requestedBudget: number;
  deadline: string;         // ISO yyyy-MM-dd
  submissionDate: string;   // ISO yyyy-MM-dd
  waiver: boolean;
  institution: Institution;
}
