export const namespace = "ui";

const initialState = {
  showCircleCommentInput: false
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
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
