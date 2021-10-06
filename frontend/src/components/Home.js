import React from 'react';
import { useDispatch } from 'react-redux';
import { pruebaTypes } from '../types/pruebaTypes';

export const Home = () => {

    const dispatch = useDispatch();

    dispatch({
        type: pruebaTypes.pruebaOf
    });

    return (
        <div>
            <h1>Home Screen</h1>
        </div>
    );

};
