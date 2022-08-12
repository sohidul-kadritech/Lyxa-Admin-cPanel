import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Form,
  Modal,
  CardTitle,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { successMsg } from "../helpers/successMsg";
import { addPercentage } from "../store/Settings/settingsAction";
import { addSellerCharge } from "../store/Seller/sellerAction";

const DropCharge = ({ chargeType, chargeValue, type, seller = null }) => {
  const dispatch = useDispatch();

  const [feeInfo, setFeeInfo] = useState({
    dropPercentageType: "",
    dropPercentage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (chargeType || chargeValue) {
      setFeeInfo({
        ...feeInfo,
        dropPercentageType: chargeType,
        dropPercentage: chargeValue,
      });
    }
  }, [chargeType, chargeValue]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFeeInfo({ ...feeInfo, [name]: value });
  };

  // VALIDATION
  const deliveryFeeSubmit = () => {
    const { dropPercentageType, dropPercentage } = feeInfo;
    if (!dropPercentageType) {
      return successMsg("Enter delivery charge type");
    }
    if (!dropPercentage) {
      return successMsg("Enter Drop charge");
    }
    setLoading(true);
    submitData();
  };
  // SUBMTI DATA TO SERVER

  const submitData = () => {
    if (type === "global") {
      dispatch(
        addPercentage({
          ...feeInfo,
        })
      );
    } else {
      dispatch(addSellerCharge({ ...feeInfo, sellerId: seller }));
    }
  };

  return (
    <Card>
      <CardBody>
        <Row>
          <Col lg={6}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Drop Charge Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="dropPercentageType"
                value={feeInfo.dropPercentageType}
                label="Drop Charge Type"
                onChange={handleChange}
                required
              >
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="percentage">Percentage</MenuItem>
              </Select>
            </FormControl>
          </Col>
          <Col lg={6} className="mt-4 mt-lg-0">
            <TextField
              style={{ width: "100%" }}
              label={`Drop Charge (${
                feeInfo.dropPercentageType === "amount"
                  ? "Amount"
                  : "Percentage"
              })`}
              variant="outlined"
              placeholder="Enter Drop Charge"
              name="dropPercentage"
              value={feeInfo.dropPercentage}
              onChange={handleChange}
              type="number"
              required
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-center mt-5">
          <Button
            disabled={loading}
            style={{ maxWidth: "200px", width: "100%" }}
            color="primary"
            onClick={deliveryFeeSubmit}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default DropCharge;
