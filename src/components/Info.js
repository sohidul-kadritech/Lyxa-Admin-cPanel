import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Info = ({ title, value, link }) => {
  const history = useHistory();

  return (
    <Details>
      <h5>{title}: </h5>
      <h5
        className="value cursor-pointer"
        style={{ textDecoration: link ? "underline" : "none" }}
        onClick={() => history.push(link)}
      >
        {value}
      </h5>
    </Details>
  );
};

const Details = styled.div`
  display: flex;
  align-items: flex-start;
`;

export default Info;
