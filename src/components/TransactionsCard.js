import { Card, CardContent } from "@mui/material";
import React from "react";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import styled from "styled-components";

const TransactionsCard = ({ summary = [] }) => {
  return (
    <CardWrapper>
      {summary.map((item, index) => (
        <div key={index} className="card hover-shadow">
          <Card>
            <CardContent className="content__wrapper cursor-pointer">
              <div>
                <h5>{item?.value}</h5>
                <h6 className="text-danger">{item?.title}</h6>
              </div>
              <CurrencyExchangeIcon className="text-success" />
            </CardContent>
          </Card>
        </div>
      ))}
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(250px, 1fr));
  grid-gap: calc(2em + 0.5vh) calc(1.5em + 1vmin);
  .card {
    max-width: 350px;
    width: 100%;
    margin-bottom: 10px;
    border: 1px solid lightgray;
    .content__wrapper {
      display: flex;
      justify-content: space-between;
      padding: 25px !important;
    }
  }
`;

export default TransactionsCard;
