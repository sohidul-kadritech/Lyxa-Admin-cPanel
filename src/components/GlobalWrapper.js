import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

const GlobalWrapper = ({ children }) => {
  //   console.log(children);
  const history = useHistory();

  const { accessToken } = useSelector(state => state.Login);

  useEffect(
    () => {
      // console.log("accessToken",accessToken);

      if (!accessToken) {
        history.replace("/login");
      }
    },
    [accessToken]
  );

  return (
    <div>
      {children}
    </div>
  );
};

export default GlobalWrapper;
