import { useState } from 'react';

/**
 *
 * @param {Object} initialState
 * @returns {Array} [values, handleInputChange]
 * @example const [formValues, handleInputChange] = useForm({
    nickname: '',
    email: '',
    password: '',
    confPassword: ''
  });

  const { nickname, email, password, confPassword } = formValues;

  <input
    name="nickname"
    value={ nickname }
    onChange={ handleInputChange}
  />

  <input
    name="email"
    value={ email }
    onChange={ handleInputChange}
  />

  <input
    name="password"
    value={ password }
    onChange={ handleInputChange}
  />

  <input
    name="confPassword"
    value={ confPassword }
    onChange={ handleInputChange}
  />
*/
export const useForm = ( initialState = {}) => {

  const [values, setValues] = useState( initialState );

  const reset = () => {

    setValues( initialState );

  };

  const handleInputChange = ({ target }) => {

    console.log( target.type );
    setValues({
      ...values,
      [target.name]: target.value
    });

  };

  return [values, handleInputChange, reset];

};
