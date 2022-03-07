import {create} from '../Style';

export default create({
  fixed: (style) => ({
    position: 'absolute',
    top: 0,
    // width: 'inherit',
    left: 'inherit',
    right: 'inherit',
    paddingLeft: 'inherit',
    paddingRight: 'inherit',
    marginLeft: 'inherit',
    marginRight: 'inherit',
    ...style,
  }),
  relative: (style, topOrBottom) => ({
    position: 'absolute',
    zIndex: 1,
    left: 0,
    right: 0,
    [topOrBottom]: 0,
    ...style,
  }),
});
