export const namespace = "notify";

const initialState = {
  messages:{}
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case `${namespace}/message`:
      const messages = state.messages;
      return {
        ...state,
        messages: {
          ...messages,
          ...action.payload
        }
      };
    default:
      return state;
  }
}
