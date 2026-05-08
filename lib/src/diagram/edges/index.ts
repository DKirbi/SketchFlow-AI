export { Edge }           from './Edge';
export type { EdgeData }  from './Edge';

import { Edge } from './Edge';

export const edgeTypes = {
  labeled: Edge,
} as const;
