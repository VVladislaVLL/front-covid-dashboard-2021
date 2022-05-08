import { DEFAULT_FONT_SIZE } from '../models';
import { animate, AnimationTriggerMetadata, style, transition, trigger } from '@angular/animations';

export function pxToRem(size: number, currentFontSize = DEFAULT_FONT_SIZE): number {
  return size / currentFontSize;
}

export function inOutAnimation(): AnimationTriggerMetadata {
  return trigger(
    'inOutAnimation',
    [
      transition(
        ':enter',
        [
          style({ transform: 'translateX(100%)' }),
          animate('0.5s ease-out',
            style({ transform: 'translateX(0)' })),
        ],
      ),
      transition(
        ':leave',
        [
          style({ transform: 'translateX(0)' }),
          animate('0.5s ease-in',
            style({ transform: 'translateX(100%)' })),
        ],
      ),
    ],
  );
}
