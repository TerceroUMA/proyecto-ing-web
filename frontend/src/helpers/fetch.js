const baseUrl = process.env.REACT_APP_API_URL;

/**
 * @param {String} endpoint Es el endpoint de la api, quitando el prefijo baseUrl
 * @param {Object} data Es el objeto que se enviara en el body de la peticion
 * @param {String} method Es el metodo de la peticion, por defecto es GET
 * @returns {Promise} Es la promesa que se resolvera cuando se reciba la respuesta de la peticion
 * @description Funcion que hace la peticion a la api. Notar que si el metodo es POST, se envia el objeto data y que el baseUrl es: http://localhost:3000/api/
 * @example const respuesta = await fetchSinToken( 'auth', { email, password }, 'POST' );
    const body = await respuesta.json();
 *
 */
export const fetchSinToken = ( endpoint, data, method = 'GET' ) => {

  const url = `${baseUrl}/${endpoint}`;

  if ( method === 'GET' ) {

    return fetch( url );

  } else {

    return fetch( url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( data )
    });

  }

};


export const fetchUrlencoded = ( endpoint, data, method = 'GET' ) => {

  const url = `${baseUrl}/${endpoint}`;

  if ( method === 'GET' ) {

    return fetch( url );

  } else {

    // Para que lo pille python con x-www-form-urlencoded
    let formBody = [];
    for ( const property in data ) {

      const encodedKey = encodeURIComponent( property );
      const encodedValue = encodeURIComponent( data[property]);
      formBody.push( encodedKey + '=' + encodedValue );

    }

    formBody = formBody.join( '&' );


    return fetch( url, {
      method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: formBody
    });

  }

};
