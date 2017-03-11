import { combineReducers } from 'redux';
import { actionTypes as types } from '../constants';

const guys = (state = [], action) => {
  switch (action.type) {
    case types.ADD_GUYS:
      return state.slice().concat(action.guys);
    default:
      return state;
  }
}

const messages = (state = [], action) => {
  switch (action.type) {
    case types.ADD_MESSAGES:
      return state.slice().concat(action.messages);
    default:
      return state;
  }
}

const currentGuy = (state = null, action) => {
  switch (action.type) {
    case types.SET_CURRENT_GUY:
      return action.guy;
    default:
      return state;
  }
}

export default combineReducers({
  currentGuy,
  guys,
  messages,
});
