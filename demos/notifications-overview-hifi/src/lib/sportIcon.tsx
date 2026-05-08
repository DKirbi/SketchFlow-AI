import type { ReactElement } from 'react';
import {
  PdsSoccerIcon,
  PdsTennisIcon,
  PdsBasketballIcon,
} from '@podium-design-system/react-components/icons.js';
import type { Sport } from '../types';

type IconSize = 'sm' | 'md';

export function SportIcon({ sport, size = 'sm' }: { sport: Sport; size?: IconSize }): ReactElement {
  switch (sport) {
    case 'Soccer':
      return <PdsSoccerIcon size={size} />;
    case 'Tennis':
      return <PdsTennisIcon size={size} />;
    case 'Basketball':
      return <PdsBasketballIcon size={size} />;
  }
}
