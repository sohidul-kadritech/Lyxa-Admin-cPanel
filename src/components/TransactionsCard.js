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
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  .card {
    max-width: 300px;
    width: 100%;
    margin-bottom: 15px;
    margin-right: 15px;
    border: 1px solid lightgray;
    .content__wrapper {
      display: flex;
      justify-content: space-between;
      padding: 25px !important;
    }
  }
`;

export default TransactionsCard;
