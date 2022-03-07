export const namespace = "gps";

const initialState = {
  lat: null,
  lng: null,
  address: null
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
