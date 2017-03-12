import { actionTypes as types } from '../constants';

export const addMessages = (messages) => ({type: types.ADD_MESSAGES, messages})
export const setCurrentGuy = (guy) => ({type: types.SET_CURRENT_GUY, guy})
