import React, { Fragment, useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core';

import { commerce } from '../../../lib/commerce';

import AddressForm from './AddressForm';
import PaymentForm from './PaymentForm';
import useStyles from './styles';

const steps = ['Shipping', 'Payment'];

const CheckoutForm = ({ cart, order, errorMessage, onCaptureCheckout }) => {
  const classes = useStyles();
  const history = useHistory();
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if (cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' });

          console.log(token);
          setCheckoutToken(token);
        } catch (error) {
          history.pushState('/');
        }
      }

      generateToken();
    }
  }, [cart]);

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const next = (data) => {
    setShippingData(data);

    nextStep();
  }

  const Form = () => activeStep === 0 ? (
    <AddressForm checkoutToken={checkoutToken} next={next} />
  ) : (
    <PaymentForm
      shippingData={shippingData}
      checkoutToken={checkoutToken}
      nextStep={nextStep}
      backStep={backStep}
      onCaptureCheckout={onCaptureCheckout}
      timeout={timeout}
    />
  );

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true)
    }, 3000);
  }

  const MockPurchase = () => isFinished ? (
    <Fragment>
      <div>
        <Typography variant='h5'>Thank you for your purchase!</Typography>
        <Divider />
      </div>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </Fragment>
  ) : (
    <div className={classes.spinner}>
      <CircularProgress />
    </div>
  );

  let Confirmation = () => order.customer ? (
    <Fragment>
      <div>
        <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
        <Divider />
        <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
      </div>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </Fragment>
  ) : (<MockPurchase />);

  if (errorMessage) {
    <Fragment>
      <Typography variant='h5'>An error occurred: {errorMessage}</Typography>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </Fragment>
  }

  return (
    <Fragment>
      <CssBaseline />
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
          {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
        </Paper>
      </main>
    </Fragment>
  )
}

export default CheckoutForm;
