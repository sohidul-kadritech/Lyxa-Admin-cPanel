import React from "react";
import { Container } from "reactstrap";
import styled from "styled-components";
import GlobalWrapper from './../components/GlobalWrapper';

const BlankPage = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>

      <div className="page-content" >
        <Container fluid={true}>

        </Container>
      </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};


const Wrapper = styled.div`


.heading{
  color: red;
}


`

export default BlankPage;
