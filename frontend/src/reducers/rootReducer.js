import { combineReducers } from 'redux';
import { pruebaReducer } from './pruebaReducer';


export const rootReducer = combineReducers({
    prueba: pruebaReducer
});
