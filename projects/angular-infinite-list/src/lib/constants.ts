export const ALIGN_AUTO: string = 'auto';
export const ALIGN_START: string = 'start';
export const ALIGN_CENTER: string = 'center';
export const ALIGN_END: string = 'end';

export type DIRECTION = 'horizontal' | 'vertical';
export const DIRECTION_VERTICAL: DIRECTION = 'vertical';
export const DIRECTION_HORIZONTAL: DIRECTION = 'horizontal';

export type SCROLL_CHANGE_REASON = 'observed' | 'requested';
export const SCROLL_CHANGE_OBSERVED: SCROLL_CHANGE_REASON = 'observed';
export const SCROLL_CHANGE_REQUESTED: SCROLL_CHANGE_REASON = 'requested';

export const scrollProp = {
  [DIRECTION_VERTICAL]: 'scrollTop',
  [DIRECTION_HORIZONTAL]: 'scrollLeft',
};

export const sizeProp = {
  [DIRECTION_VERTICAL]: 'height',
  [DIRECTION_HORIZONTAL]: 'width',
};

export const positionProp = {
  [DIRECTION_VERTICAL]: 'top',
  [DIRECTION_HORIZONTAL]: 'left',
};
