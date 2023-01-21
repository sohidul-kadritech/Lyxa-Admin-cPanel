import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import styled from "styled-components";
import ChatMessageTable from "../../components/ChatMessageTable";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";

const DefaultChat = () => {
  const { loading } = useSelector((state) => state.settingsReducer);

  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumb
              maintitle="Lyxa"
              breadcrumbItem="Default Chat Message"
              title="Admin"
              // loading={loading}
              // callList={callList}
              isRefresh={false}
            />

            <ChatMessageTable />
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

const Wrapper = styled.div`
  .heading {
    color: red;
  }
`;

export default DefaultChat;
