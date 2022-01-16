import React from 'react';
import ReactDOM from 'react-dom';

// eslint-disable-next-line no-undef
const PayPalButton = paypal.Buttons.driver( 'react', { React, ReactDOM });

export default function Paypal() {

  const createOrder = ( data, actions ) => {

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '0.01'
          }
        }
      ]
    });

  };

  const onApprove = ( data, actions ) => {

    return actions.order.capture();

  };


  return (
    <div>
      <h1>Paypal</h1>
      <PayPalButton
        createOrder={( data, actions ) => createOrder( data, actions )}
        onApprove={( data, actions ) => onApprove( data, actions )}
      />
    </div>
  );

}
