// import React from "react";
// import { useHistory } from "react-router-dom";
import requestApi from "../network/httpRequest";

// const history = useHistory();

export const callApi = async (sId, api, type) => {
  try {
    const { data } = await requestApi().request(api, {
      params: {
        id: sId,
      },
    });

    if (data.status) {
      console.log("single order dta", data);
      return data.data[type];
    }
  } catch (e) {
    console.log(e.message);
  }
};
