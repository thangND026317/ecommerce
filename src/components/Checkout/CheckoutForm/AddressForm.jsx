import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';

import { commerce } from '../../../lib/commerce';

import CustomTextField from './CustomTextField';

const AddressForm = ({ checkoutToken, next }) => {
  const methods = useForm();
  const [country, setCountry] = useState('');
  const [shippingCountries, setShippingCountries] = useState([]);
  const [subdivision, setSubdivision] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [option, setOption] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setCountry(Object.keys(countries)[0]);
  }

  const fetchSubdivisions = async (countryName) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryName);

    setShippingSubdivisions(subdivisions);
    setSubdivision(Object.keys(subdivisions)[0]);
  }

  const fetchShippingOptions = async (checkoutTokenId, countryName, region = null) => {
    console.log('Country: ', country);
    console.log('Subdivision: ', subdivision);

    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country: countryName, region: region });

    console.log('Options: ', options);
    setShippingOptions(options);
    setOption(options[0].id);
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  useEffect(() => {
    if (country) fetchSubdivisions(country);
  }, [country]);

  useEffect(() => {
    if (subdivision) fetchShippingOptions(checkoutToken.id, country, subdivision);
  }, [subdivision]);

  return (
    <Fragment>
      <Typography variant='h6' gutterBottom style={{ margin: '20px 0' }}>Shipping Address</Typography>
      <FormProvider{...methods}>
        <form onSubmit={methods.handleSubmit((data) => next({ ...data, country: country, subdivision: subdivision, option: option }))}>
          <Grid container spacing={3}>
            <CustomTextField required name='firstName' label='First name' />
            <CustomTextField required name='lastName' label='Last name' />
            <CustomTextField required fullWidth name='email' label='Email' />
            <CustomTextField required name='phone' label='Phone number' />
            <CustomTextField required name='address' label='Address' />
            <CustomTextField required name='city' label='City' />
            <CustomTextField required name='zip' label='ZIP / Postal code' />

            <Grid item xs={12} sm={6}>
              <InputLabel>Country</InputLabel>
              <Select value={country} fullWidth onChange={e => setCountry(e.target.value)}>
                {Object.entries(shippingCountries).map(([code, name]) => (
                  <MenuItem key={code} value={code}>{name}</MenuItem>)
                )}
              </Select>
            </Grid>


            <Grid item xs={12} sm={6}>
              <InputLabel>Subdivision</InputLabel>
              <Select value={subdivision} fullWidth onChange={e => setSubdivision(e.target.value)}>
                {Object.entries(shippingSubdivisions).map(([code, name]) => (
                  <MenuItem key={code} value={code}>{name}</MenuItem>)
                )}
              </Select>
            </Grid>


            <Grid item xs={12} sm={6}>
              <InputLabel>Options</InputLabel>
              <Select value={option} fullWidth onChange={e => setOption(e.target.value)}>
                {shippingOptions.map((sO) =>
                (<MenuItem key={sO.id} value={sO.id}>
                  {`${sO.description} - ${sO.price.formatted_with_code}`}
                </MenuItem>)
                )}
              </Select>
            </Grid>
          </Grid>

          <br />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button component={Link} to='/cart' variant='outlined'>Back to cart</Button>
            <Button type='submit' variant='contained' color='primary'>Next</Button>
          </div>

        </form>
      </FormProvider>
    </Fragment>
  )
}

export default AddressForm;
