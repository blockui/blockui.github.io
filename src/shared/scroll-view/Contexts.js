import createReactContext from 'create-react-context';

export const ObserverContext = createReactContext({
  ref: () => {
  },
  isIntersecting: true,
  // visibleIds: {},
});

export const StickyContext = createReactContext();

export const FixedContext = createReactContext();

export const RefreshContext = createReactContext();
