import React from "react";
import { useSelector } from "react-redux";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import TextEditor from "../../components/TextEditor/TextEditor";
import { Container } from "reactstrap";

const ShopTermsAndConditions = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <TextEditor title="Shop Terms and Condtions" type="shop" />
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default ShopTermsAndConditions;
