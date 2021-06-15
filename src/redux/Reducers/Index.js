let initState = {};

export const UserReducer = (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "TOTAL_VOTES":
      return {
        ...state,
        totalV: payload,
      };
    case "HAS_VOTED":
      return {
        ...state,
        hasvoted: payload,
      };

    default:
      return state;
  }
};
