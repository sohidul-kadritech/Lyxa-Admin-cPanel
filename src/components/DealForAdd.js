import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { getAllDealForAdd } from "../store/Deal/dealAction";
import { addProductDeal } from "../store/Product/productAction";
import { addShopDeal } from "../store/Shop/shopAction";

const DealForAdd = ({ type, item, shopType }) => {
  const dispatch = useDispatch();
  const { deals } = useSelector((state) => state.dealReducer);
  const { loading } = useSelector((state) => state.productReducer);
  const {loading:shopLoading } = useSelector((state) => state.shopReducer);

  const [deal, setDeal] = useState(null);
  const [searchDealKey, setSearchDealKey] = useState("");

  useEffect(() => {
    dispatch(getAllDealForAdd(type, shopType));
  }, []);

  const addDeal = () => {
    console.log(item)
    

    if(item.deals.length === 0){
      callApi(type)
    }else{
      const findDeal = item?.deals.find((item) => item._id == deal._id);
      if (findDeal) {
        return toast.warn("Deal Already Added!.Try Another One", {
          // position: "bottom-right",
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        callApi(type)
        // if (type === "product") {
        //   dispatch(
        //     addProductDeal({
        //       productId: item._id,
        //       dealId: deal._id,
        //     })
        //   );
        // } else {
        //   dispatch(
        //     addShopDeal({
        //       shopId: item._id,
        //       dealId: deal._id,
        //     })
        //   );
        // }
      }
    }

    
  };

  // DEAL SAVE TO SERVER 

  const callApi = (value) =>{
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
  }

  return (
    <div>
      <Autocomplete
        className="cursor-pointer"
        onChange={(event, newValue) => {
          // console.log(newValue);
          setDeal(newValue);
        }}
        getOptionLabel={(option) => option.name}
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
