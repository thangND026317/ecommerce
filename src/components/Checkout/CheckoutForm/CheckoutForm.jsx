import React, { Fragment, useState, useEffect } from 'react';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core';

import { commerce } from '../../../lib/commerce';

import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import useStyles from './styles';

const steps = ['Shipping', 'Payment'];

const CheckoutForm = ({ cart, order, errorMessage, onCaptureCheckout }) => {
  const classes = useStyles();
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});

  useEffect(() => {
    const generateToken = async () => {
      try {
        const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

        console.log(token);
        setCheckoutToken(token);
      } catch (error) {
        console.log(error);
      }
    }

    generateToken();
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);

    nextStep();
  }

  const Confirmation = () => (
    <div>Confirmation</div>
  )

  return (
    <Fragment>
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant='h4' align='center'>Checkout</Typography>
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map(step => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {(activeStep === 0 && checkoutToken) &&
            <AddressForm checkoutToken={checkoutToken} next={next} />}
          {activeStep === 1 &&
            <PaymentForm
              shippingData={shippingData}
              checkoutToken={checkoutToken}
              nextStep={nextStep}
              backStep={backStep}
              onCaptureCheckout={onCaptureCheckout}
            />}
          {activeStep === steps.length && <Confirmation />}
        </Paper>
      </main>
    </Fragment>
  )
}

export default CheckoutForm;
