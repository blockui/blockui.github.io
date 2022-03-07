export const namespace = "img";


const initialState = {
  __pics: {},
  counter: 0,
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/setState`:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
