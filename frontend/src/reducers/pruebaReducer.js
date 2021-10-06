import { pruebaTypes } from '../types/pruebaTypes';

const initialState = {
    checking: true
};


export const pruebaReducer = ( state = initialState, action ) => {

    switch ( action.type ) {

        case pruebaTypes.pruebaOf:
            return {
                checking: false
            };

        case pruebaTypes.pruebaOn:
            return {
                checking: true
            };

        default:
            return state;

    }

};
