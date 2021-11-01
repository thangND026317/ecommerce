import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Container, Typography, Button, Grid } from '@material-ui/core';

import useStyles from './styles'
import CartItem from './CartItem/CartItem';

const Cart = ({ cart, onUpdateCartQty, onRemoveFromCart, onEmptyCart }) => {
  const classes = useStyles();

  const EmptyCart = () => {
    return <Typography variant='subtitle1'>Your cart is empty,
      <Link to='/' className={classes.link}> go shopping now</Link>
    </Typography>
  }


  const FilledCart = () => {
    return <Fragment>
      <Grid container spacing={3}>
        {cart.line_items.map((item) => (
          <Grid item xs={12} sm={4} key={item.id}>
            <CartItem item={item} onUpdateCartQty={onUpdateCartQty} onRemoveFromCart={onRemoveFromCart} />
          </Grid>
        ))}
      </Grid>
      <div className={classes.cardDetails}>
        <Typography variant='h3'>Subtotal: {cart.subtotal.formatted_with_code}</Typography>
        <div>
          <Button className={classes.emptyButton} size='large' type='button' variant='contained' color='secondary' onClick={onEmptyCart}>Empty cart</Button>
          <Button component={Link} to='/checkout' className={classes.checkoutButton} size='large' type='button' variant='contained' color='primary'>Checkout</Button>
        </div>
      </div>
    </Fragment>
  }

  if (!cart.line_items) return <Container>
    <div className={classes.toolbar} />
    <Typography className={classes.title} variant='h3'>Loading...</Typography>
  </Container>;

  return <Container>
    <div className={classes.toolbar} />
    <Typography className={classes.title} variant='h3' gutterBottom>Your shopping cart</Typography>

    {!cart.line_items.length ? <EmptyCart /> : <FilledCart />}
  </Container>
}

export default Cart;
