import React from 'react';
import { useDispatch } from 'react-redux';
import { pruebaTypes } from '../types/pruebaTypes';

export const About = () => {

    const dispatch = useDispatch();

    dispatch({
        type: pruebaTypes.pruebaOn
    });

    return (
        <div>
            <h1>About Screen</h1>
        </div>
    );

};
