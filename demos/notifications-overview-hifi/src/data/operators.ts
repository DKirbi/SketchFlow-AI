import type { OperatorId } from '../types';

export interface Operator {
  id: OperatorId;
  displayName: string;
  initials: string;
}

export const OPERATORS: Operator[] = [
  { id: 'r.operator', displayName: 'R. Operator', initials: 'RO' },
  { id: 'm.kovac', displayName: 'M. Kovac', initials: 'MK' },
  { id: 'a.scout', displayName: 'A. Scout', initials: 'AS' },
  { id: 'j.lopez', displayName: 'J. Lopez', initials: 'JL' },
  { id: 't.huang', displayName: 'T. Huang', initials: 'TH' },
];

export function operatorById(id: OperatorId | undefined): Operator | undefined {
  return OPERATORS.find((o) => o.id === id);
}
