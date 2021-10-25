import React from 'react';
import { useDispatch } from 'react-redux';
import { pruebaTypes } from '../types/pruebaTypes';

export const Home = () => {

    const dispatch = useDispatch();

    dispatch({
        type: pruebaTypes.pruebaOf
    });

    const onSignIn = ( ) => {

        // gapi viene de script del html de google
        // eslint-disable-next-line no-undef
        const auth2 = gapi.auth2.init();
        if ( auth2.isSignedIn.get() ) {

            const profile = auth2.currentUser.get().getBasicProfile();
            console.log( 'ID: ' + profile.getId() );
            console.log( 'Full Name: ' + profile.getName() );
            console.log( 'Given Name: ' + profile.getGivenName() );
            console.log( 'Family Name: ' + profile.getFamilyName() );
            console.log( 'Image URL: ' + profile.getImageUrl() );
            console.log( 'Email: ' + profile.getEmail() );

        }

    };

    return (
        <div>
            <h1>Home Screen</h1>
            <div className="g-signin2" data-onsuccess="onSignIn" >

            </div>
            <button onClick={onSignIn} >Ver datos</button>
        </div>
    );

};
