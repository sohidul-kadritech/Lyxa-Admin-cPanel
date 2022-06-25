import React from "react";
import { Card, CardBody, CardTitle, Container } from "reactstrap";
import GlobalWrapper from "./GlobalWrapper";
import Info from "./Info";
import Map from "./Map";

const TrackingDeliveryBoy = () => {
  return (
    <React.Fragment>
      <GlobalWrapper>
        <Card>
          <CardBody>
            <CardTitle> Information </CardTitle>
            <hr />
            <Info title="Name" value="Shuvo" />
            <Info title="Status" value={"Online"} />
            <Info title="Time" value={"25/07/2021"} />
          </CardBody>
        </Card>

        <Map />
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default TrackingDeliveryBoy;
