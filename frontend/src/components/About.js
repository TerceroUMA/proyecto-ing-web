import React from 'react';
import { useDispatch } from 'react-redux';
import { pruebaTypes } from '../types/pruebaTypes';

export const About = () => {

    const dispatch = useDispatch();

    dispatch({
        type: pruebaTypes.pruebaOn
    });

    const handleSubmit = ( e ) => {

        e.preventdefault();
        fetch( 'localhost://8000/api/singIn/', {
            method: 'POST'
        });

    };

    return (
        <div>
            <h1>About Screen</h1>
            <form onSubmit={handleSubmit}>
                <input type="text"/>
                <button> Iniciar sesion</button>
            </form>
        </div>
    );

};
