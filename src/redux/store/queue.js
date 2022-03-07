export const namespace = "queue";

const initialState = {
  rows: [],
};

export default function defaultReducer(
  state = initialState,
  action
) {

  switch (action.type) {
    case `${namespace}/addList`:
      return {
        ...state,
        rows: [
          {
            ...action.payload,
            createdAt: +(new Date())
          },
          ...state.rows
        ]
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
