import React from "react";
import { Container } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";

const PercentageSetting = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Drop"
              breadcrumbItem={"Percentage Setting"}
              // loading={loading}
              // callList={callCarList}
              isRefresh={false}
            />
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};



export default PercentageSetting;
