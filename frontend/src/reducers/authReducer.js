import { types } from '../types/types';

const initialState = {};

export const authReducer = ( state = initialState, action ) => {

  switch ( action.type ) {

    case types.login:
      return {
        ...state,
        uuid: action.payload.nombre,
        ...action.payload
      };

    case types.logout:
      return initialState;

    default:
      return state;

  }

};
