import React from 'react';
import { useDispatch } from 'react-redux';
import { pruebaTypes } from '../types/pruebaTypes';

export const Home = () => {

    fetch( 'https://localhost:8000', {
        method: 'get'
    })
        .then( ( res ) => {

            return res.json();

        }).then( data => console.log( data ) );

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
