import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { successMsg } from "../helpers/successMsg";
import { getAllDealForAdd } from "../store/Deal/dealAction";
import { addProductDeal } from "../store/Product/productAction";
import { addShopDeal } from "../store/Shop/shopAction";

const DealForAdd = ({ type, item, shopType }) => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.dealReducer);
  const { loading } = useSelector((state) => state.productReducer);
  const { loading: shopLoading } = useSelector((state) => state.shopReducer);

  const [deal, setDeal] = useState(null);
  const [searchDealKey, setSearchDealKey] = useState("");

  useEffect(() => {
    dispatch(getAllDealForAdd(type, shopType));
  }, []);

  const addDeal = () => {
    if (item.deals.length === 0) {
      callApi(type);
    } else {
      const findDeal = item?.deals.find((item) => item._id == deal._id);
      const findDoubleDeal = item?.deals.find(
        (item) => item.option === "double_menu"
      );
      const findPercentage = item?.deals.find(
        (item) => item.option === "percentage"
      );
      // console.log({ findDoubleDeal, findPercentage });
      if (
        (deal.option === "percentage" && findDoubleDeal) ||
        (deal.option === "double_menu" && findPercentage)
      ) {
        return successMsg(
          "You can not add percentage or double deal in same shop"
        );
      }

      if (findDeal) {
        return successMsg("Deal Already Added!.Try Another One");
      } else {
        callApi(type);
      }
    }
  };

  // DEAL SAVE TO SERVER

  const callApi = (value) => {
    if (value === "product") {
      dispatch(
        addProductDeal({
          productId: item._id,
          dealId: deal._id,
        })
      );
    } else {
      dispatch(
        addShopDeal({
          shopId: item._id,
          dealId: deal._id,
        })
      );
    }
  };

  return (
    <div>
      <Autocomplete
        className="cursor-pointer"
        onChange={(event, newValue) => {
          // console.log(newValue);
          setDeal(newValue);
        }}
        getOptionLabel={(option) => option.option}
        isOptionEqualToValue={(option, value) => option._id == value._id}
        inputValue={searchDealKey}
        onInputChange={(event, newInputValue) => {
          setSearchDealKey(newInputValue);
          // console.log("input value", newInputValue);
        }}
        id="controllable-states-demo"
        options={deals.length > 0 ? deals : []}
        sx={{ width: "100%" }}
        renderInput={(params) => (
          <TextField {...params} label="Select a Deal" />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...props}
            key={option._id}
          >
            {option.option}
            {option.option === "percentage" && `(${option.percentage}%)`}
          </Box>
        )}
      />
      <div className="d-flex justify-content-center mt-3">
        <Button color="primary" className="px-4" onClick={addDeal}>
          {loading || shopLoading ? "Loading..." : "Add"}
        </Button>
      </div>
    </div>
  );
};

export default DealForAdd;
