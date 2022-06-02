import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import { addDeliveryCharge, getDeliveryCharge } from "../../../store/appWallet/appWalletAction";
import { getAllShop } from "../../../store/Shop/shopAction";

const PercentageSetting = () => {
  const dispatch = useDispatch();

  const { shops } = useSelector((state) => state.shopReducer);
  const {loading, deliveryFee} = useSelector((state) => state.appWalletReducer);

  const [feeInfo, setFeeInfo] = useState({
    deliveryFeePerKm: "",
    dropChargePerKm: "",
    deliveryApplied: "",
  });
  const [searchShopKey, setSearchShopKey] = useState("");
  const [shop, setShop] = useState(null);

  useEffect(()=>{
    callDeliveryFee(true)
  },[])

  const callDeliveryFee = (refresh = false) =>{
    dispatch(getDeliveryCharge(refresh))
  }

  useEffect(()=>{
    if(deliveryFee){
      setFeeInfo({
        deliveryFeePerKm: deliveryFee.deliveryFeePerKm,
        dropChargePerKm: deliveryFee.dropChargePerKm,
        
      })
    }
  },[deliveryFee])

  const handleChange = (event) => {

      const { name, value } = event.target;
      // console.log({ name, value });
      setFeeInfo({ ...feeInfo, [name]: value });
    
  };

  // GET ALL SHOP
  useEffect(() => {
    if (feeInfo.deliveryApplied === "shop") {
      dispatch(getAllShop(true));
    }
  }, [feeInfo?.deliveryApplied]);


  // VALIDATION
  const DeliveryFeeSubmit = () =>{
    const {deliveryFeePerKm, dropChargePerKm, deliveryApplied} = feeInfo;
    if(!deliveryFeePerKm){
      return WarningMessage('Enter delivery Fee Per Km ');
    }
    if(!dropChargePerKm){
      return WarningMessage('Enter Drop charge Per Km ');
    }
    if(!deliveryApplied){
      return WarningMessage('Select Applied For ');
    }

    if(deliveryApplied === 'shop' && !shop){
      return WarningMessage('Select a shop ');
    }

    submitData()
  }
  // SUBMTI DATA TO SERVER 

  const submitData = () => {
    dispatch(addDeliveryCharge({...feeInfo, shopId: feeInfo.deliveryApplied === 'shop' ?  shop?._id : null}));
  }

  // WARINIG MESSAGE

  const WarningMessage = (message) => {
    toast.warn(message, {
      // position: "bottom-right",
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              title="App Wallet"
              breadcrumbItem={"Percentage Setting"}
              loading={loading}
              callList={callDeliveryFee}
            />
            <Card>
              <CardBody>
                <Row>
                  <Col lg={6}>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Delivery Fee(Per KM)"
                      variant="outlined"
                      name="deliveryFeePerKm"
                      placeholder="Enter Delivery feeInfo(Per KM)"
                      value={feeInfo.deliveryFeePerKm}
                      onChange={handleChange}
                      type="number"
                      required
                    />
                  </Col>
                  <Col lg={6} className='mt-4 mt-lg-0'>
                    <TextField
                      style={{ width: "100%" }}
                      id="outlined-basic"
                      label="Drop feeInfo(Per KM)"
                      variant="outlined"
                      placeholder="Enter Drop feeInfo(Per KM)"
                      name="dropChargePerKm"
                      value={feeInfo.dropChargePerKm}
                      onChange={handleChange}
                      type="number"
                      required
                    />
                  </Col>
                </Row>
                <Row className='mt-4'>
                  <Col lg={6}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Applied For
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="deliveryApplied"
                        value={feeInfo.deliveryApplied}
                        label="Shop Type"
                        onChange={handleChange}
                        required
                      >
                        <MenuItem value="shop">Shop</MenuItem>
                        <MenuItem value="global">Global</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col lg={6} className="mt-4 mt-lg-0">
                    {feeInfo.deliveryApplied === "shop" && (
                      <Autocomplete
                        className="cursor-pointer"
                        value={shop}
                        onChange={(event, newValue) =>
                          setShop(newValue)
                        }
                        getOptionLabel={(option) =>
                          option.shopName ? option.shopName : ""
                        }
                        isOptionEqualToValue={(option, value) =>
                          option._id == value._id
                        }
                        inputValue={searchShopKey}
                        onInputChange={(event, newInputValue) => {
                          setSearchShopKey(newInputValue);
                          // console.log("input value", newInputValue);
                        }}
                        id="controllable-states-demo"
                        options={shops.length > 0 ? shops : []}
                        sx={{ width: "100%" }}
                        renderInput={(params) => (
                          <TextField {...params} label="Select a Shop" />
                        )}
                        renderOption={(props, option) => (
                          <Box
                            component="li"
                            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                            {...props}
                          >
                            <img
                              loading="lazy"
                              width="60"
                              src={option.shopBanner}
                              alt=""
                            />
                            {option.shopName}
                          </Box>
                        )}
                      />
                    )}
                  </Col>
                </Row>
                <div className='d-flex justify-content-center mt-5'>
                  <Button disabled={loading} style={{maxWidth: '200px', width: '100%'}} color='primary' onClick={DeliveryFeeSubmit}>{loading ? "Loading..." : "Add"}</Button>
                </div>
              </CardBody>
            </Card>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default PercentageSetting; 
