import React from "react";
import { Container } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TableForList from "../../../components/TableForList";
import TransactionsCard from "../../../components/TransactionsCard";
const SellerTransactions = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem="Seller Transactions"
              title="App Wallet"
              // loading={loading}
              // callList={callTransList}
            />

            <div>
              <TransactionsCard />
            </div>

            <div>
              <TableForList />
            </div>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default SellerTransactions;
