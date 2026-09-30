// Starting point for your characterisation tests of the grant rules.
// Organise them however you like; this file is only a seed.
import { FundingRequest } from './funding-request.model';

function request(overrides: Partial<FundingRequest> = {}): FundingRequest {
  return {
    id: 1,
    title: 'Test request',
    type: 'DEVELOPMENT',
    requestedBudget: 100000,
    deadline: '2026-06-30',
    submissionDate: '2026-06-01',
    waiver: false,
    institution: { id: 1, name: 'Test institution', type: 'NON_PROFIT' },
    ...overrides
  };
}

describe('Grant rules', () => {
  it.skip('applies the 60% base rate', () => {
    // Your turn: where do the rules to test live today?
    expect(request().requestedBudget).toBe(100000);
  });
});
