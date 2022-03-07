import {arrayOf, func, node, number, object, oneOfType} from 'prop-types';

export const refType = oneOfType([func, object]);
export const thresholdType = oneOfType([number, arrayOf(number)]);
export const stickyNodeType = oneOfType([func, node]);
