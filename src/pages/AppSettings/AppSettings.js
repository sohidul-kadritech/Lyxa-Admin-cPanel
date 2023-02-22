import { FormControl, Grid, InputLabel, MenuItem, OutlinedInput, Paper, Select, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, Container, Spinner } from 'reactstrap';
import currenciesList from '../../common/data/currencyList';
import Breadcrumb from '../../components/Common/Breadcrumb';
import GlobalWrapper from '../../components/GlobalWrapper';
import {
  getAllAppSettings,
  // removeSearchButlerKm,
  removeSearchDeliveryBoyKm,
  updateAppSettings,
  updateCurrency,
  updateDropCreditLimit,
  updateMaxDiscount,
  updateMaxDistanceForButler,
  updateNearByShopKey,
  // updateSearchButlerKm,
  updateSearchDeliveryBoyKm,
  updateVat,
} from '../../store/Settings/settingsAction';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const dataLoadingIntitial = {
  maxDiscount: false,
  vat: false,
  nearByShopKm: false,
  currency: false,
  maxCustomerServiceValue: false,
  maxCustomerButlerServiceValue: false,
  searchDeliveryBoyKm: false,
  maxDistanceForButler: false,
  searchDeliveryBoyKmForButler: false,
};

function AppSettings() {
  const dispatch = useDispatch();
  const { loading, appSettingsOptions } = useSelector((state) => state.settingsReducer);
  const [areaChangeKey, setAreaChangeKey] = useState('');
  // const [areaChangeKeyButler, setAreaChangeKeyButler] = useState('');
  const [dataIsLoading, setDataIsLoading] = useState(dataLoadingIntitial);

  // get all settings
  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  // change state for buttons
  useEffect(() => {
    if (loading === false) {
      setDataIsLoading(dataLoadingIntitial);
    }
  }, [loading]);

  const updateSettings = (type) => {
    dispatch(updateAppSettings(type));
  };

  // dispatch area search key
  // eslint-disable-next-line consistent-return
  const handleKmAdd = (evt) => {
    if (['Enter', 'Tab', ','].includes(evt.key)) {
      evt.preventDefault();
      const value = areaChangeKey.trim();

      if (appSettingsOptions.searchDeliveryBoyKm.length === 3) {
        return toast.warn('Maximum 3 items can add', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

      if (value) {
        setAreaChangeKey('');
        dispatch(updateSearchDeliveryBoyKm(value));
      }
    }
  };
  // eslint-disable-next-line consistent-return
  // const handleButlerKmAdd = (evt) => {
  //   if (['Enter', 'Tab', ','].includes(evt.key)) {
  //     evt.preventDefault();
  //     const value = areaChangeKeyButler.trim();

  //     if (appSettingsOptions.searchDeliveryBoyKmForButler.length === 3) {
  //       return toast.warn('Maximum 3 items can add', {
  //         position: toast.POSITION.TOP_RIGHT,
  //         autoClose: 3000,
  //         hideProgressBar: true,
  //         closeOnClick: true,
  //         pauseOnHover: true,
  //         draggable: true,
  //         progress: undefined,
  //       });
  //     }

  //     if (value) {
  //       setAreaChangeKeyButler('');
  //       dispatch(updateSearchButlerKm(value));
  //     }
  //   }
  // };

  return (
    <GlobalWrapper>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb maintitle="Lyxa" breadcrumbItem="App Settings" isRefresh={false} />
          <Card style={{ marginBottom: '10px' }}>
            <CardBody>
              <Grid spacing={3} container>
                {/* Lyxa Pay Limit */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Lyxa Pay Limit (Customer Service)"
                      variant="outlined"
                      placeholder="Enter drop pay limit credit "
                      value={appSettingsOptions?.maxCustomerServiceValue ?? 0}
                      onChange={(e) => {
                        dispatch(updateDropCreditLimit(e.target.value));
                        setDataIsLoading((prev) => ({
                          ...prev,
                          maxCustomerServiceValue: true,
                        }));
                      }}
                      type="number"
                      name="maxCustomerServiceValue"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['maxCustomerServiceValue']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          maxCustomerServiceValue: true,
                        }));
                      }}
                      disabled={dataIsLoading.maxCustomerServiceValue}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.maxCustomerServiceValue ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* near by shop km */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Near Shop Distance (KM)"
                      variant="outlined"
                      placeholder="Enter near shop Distance"
                      value={appSettingsOptions?.nearByShopKm ?? 0}
                      onChange={(e) => {
                        dispatch(updateNearByShopKey(e.target.value));
                      }}
                      type="number"
                      name="nearByShopKm"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['nearByShopKm']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          nearByShopKm: true,
                        }));
                      }}
                      disabled={dataIsLoading.nearByShopKm}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.nearByShopKm ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* max discount */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Max Discount Amount (Shops)"
                      variant="outlined"
                      placeholder="Enter max discount"
                      value={appSettingsOptions?.maxDiscount ?? 0}
                      onChange={(e) => {
                        dispatch(updateMaxDiscount(e.target.value));
                      }}
                      type="number"
                      name="maxDiscount"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['maxDiscount']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          maxDiscount: true,
                        }));
                      }}
                      disabled={dataIsLoading.maxDiscount}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        border: 0,
                        marginLeft: '5px',
                      }}
                    >
                      {dataIsLoading.maxDiscount ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* Max Item Price */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Max Item Price (Butler)"
                      variant="outlined"
                      placeholder="Enter max amount"
                      value={0}
                      onChange={() => {
                        // dispatch(updateMaxDiscount(e.target.value));
                        // checkIsUpdates(e);
                      }}
                      type="number"
                      name="maxCustomerButlerServiceValue"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['maxCustomerButlerServiceValue']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          maxCustomerButlerServiceValue: true,
                        }));
                      }}
                      disabled={dataIsLoading.maxCustomerButlerServiceValue}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.maxCustomerButlerServiceValue ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* VAT */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="VAT (Percentage)"
                      variant="outlined"
                      placeholder="Enter VAT Percentage"
                      value={appSettingsOptions?.vat || 0}
                      onChange={(e) => {
                        dispatch(updateVat(e.target.value));
                      }}
                      type="number"
                      name="vat"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['vat']);
                        setDataIsLoading((prev) => ({ ...prev, vat: true }));
                      }}
                      disabled={dataIsLoading.vat}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.vat ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* Currency */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <FormControl sx={{ width: '100%' }}>
                      <InputLabel>Currency</InputLabel>
                      <Select
                        value={appSettingsOptions?.currency?.code ?? ''}
                        label="Currency"
                        onChange={(e) => {
                          const currencyObj = currenciesList.find((currencyObj) => currencyObj.code === e.target.value);
                          dispatch(updateCurrency(currencyObj));
                        }}
                        input={<OutlinedInput label="Currency" name="currency" />}
                        MenuProps={MenuProps}
                      >
                        {currenciesList.map(({ code, name }) => (
                          <MenuItem key={code} value={code}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['currency']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          currency: true,
                        }));
                      }}
                      disabled={dataIsLoading.currency}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.currency ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* max butler distance */}
                <Grid item md={6}>
                  <Stack spacing={2} direction="row">
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Max Butler Distance (KM)"
                      variant="outlined"
                      placeholder="Enter max butler distance"
                      value={appSettingsOptions?.maxDistanceForButler ?? 0}
                      onChange={(e) => {
                        dispatch(updateMaxDistanceForButler(e.target.value));
                      }}
                      type="number"
                      name="maxDistanceForButler"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['maxDistanceForButler']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          maxDistanceForButler: true,
                        }));
                      }}
                      disabled={dataIsLoading.maxDistanceForButler}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.maxDistanceForButler ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                </Grid>
                {/* Delivery Boy Search Area */}
                <Grid item xs={12}>
                  <Stack spacing={2} direction="row" mb={2}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Delivery Boy Search Area"
                      variant="outlined"
                      placeholder="Type search area then press Enter"
                      value={areaChangeKey}
                      type="number"
                      onKeyDown={handleKmAdd}
                      onChange={(e) => setAreaChangeKey(e.target.value)}
                      name="searchDeliveryBoyKm"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['searchDeliveryBoyKm']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          searchDeliveryBoyKm: true,
                        }));
                      }}
                      disabled={dataIsLoading.searchDeliveryBoyKm}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.searchDeliveryBoyKm ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                  {appSettingsOptions?.searchDeliveryBoyKm?.length > 0 && (
                    <Paper className=" p-3">
                      {appSettingsOptions?.searchDeliveryBoyKm?.map((item, index) => (
                        <div className="tag__wrapper" key={index}>
                          {item}
                          <button
                            type="button"
                            className="button"
                            onClick={() => dispatch(removeSearchDeliveryBoyKm(index))}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </Paper>
                  )}
                </Grid>
                {/* Butler Boy Search Area */}
                {/* <Grid item xs={12}>
                  <Stack spacing={2} direction="row" mb={2}>
                    <TextField
                      style={{ width: '100%' }}
                      id="outlined-basic"
                      label="Butler Search Area"
                      variant="outlined"
                      placeholder="Type search area then press Enter"
                      value={areaChangeKeyButler}
                      type="number"
                      onKeyDown={handleButlerKmAdd}
                      onChange={(e) => setAreaChangeKeyButler(e.target.value)}
                      name="searchDeliveryBoyKmForButler"
                    />
                    <Button
                      color="success"
                      onClick={() => {
                        updateSettings(['searchDeliveryBoyKmForButler']);
                        setDataIsLoading((prev) => ({
                          ...prev,
                          searchDeliveryBoyKmForButler: true,
                        }));
                      }}
                      disabled={dataIsLoading.searchDeliveryBoyKmForButler}
                      className="d-block"
                      style={{
                        width: '20%',
                        padding: '10px 0',
                        backgroundColor: '#313131',
                        marginLeft: '5px',
                        border: 0,
                      }}
                    >
                      {dataIsLoading.searchDeliveryBoyKmForButler ? (
                        <Spinner animation="border" variant="success" size="sm"></Spinner>
                      ) : (
                        'Update'
                      )}
                    </Button>
                  </Stack>
                  {appSettingsOptions?.searchDeliveryBoyKmForButler?.length > 0 && (
                    <Paper className=" p-3">
                      {appSettingsOptions?.searchDeliveryBoyKmForButler?.map((item, index) => (
                        <div className="tag__wrapper" key={Math.random()}>
                          {item}
                          <button
                            type="button"
                            className="button"
                            onClick={() => dispatch(removeSearchButlerKm(index))}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </Paper>
                  )}
                </Grid> */}
              </Grid>
            </CardBody>
          </Card>
        </Container>
      </div>
    </GlobalWrapper>
  );
}

export default AppSettings;
