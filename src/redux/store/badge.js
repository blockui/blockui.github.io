export const namespace = "badge";


const initialState = {
  badgeDots: {},
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/setBadgeDot`:
      return {
        ...state,
        badgeDots: {
          ...state.badgeDots,
          ...action.payload
        }
      };
    case `${namespace}/init`:
      return {
        ...initialState
      };
    case `${namespace}/setState`:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
