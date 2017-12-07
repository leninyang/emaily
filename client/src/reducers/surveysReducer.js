import { FETCH_SURVEYS } from '../actions/types';

// state starts as empty array
export default function(state = [], action) {
  switch (action.type) {
    case FETCH_SURVEYS:
      return action.payload;
    default:
      return state;
  }
}
