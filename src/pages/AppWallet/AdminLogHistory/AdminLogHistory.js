import React from "react";
import { Container } from "reactstrap";
import Breadcrumb from "../../../components/Common/Breadcrumb";
import GlobalWrapper from "../../../components/GlobalWrapper";
import TableForList from "./../../../components/TableForList";

const AdminLogHistory = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem="Admin Log History"

              // loading={loading}
              // callList={callTransList}
            />
            <div>
              <TableForList />
            </div>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default AdminLogHistory;
