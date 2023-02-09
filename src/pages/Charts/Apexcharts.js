import React from 'react';
import MetaTags from 'react-meta-tags';

// import apexChart
import { Card, CardBody, Col, Row } from 'reactstrap';
import AreaChart from '../AllCharts/apex/areachart';
import BarApexChart from '../AllCharts/apex/barchart';
import LineApexChart from '../AllCharts/apex/chartapex';
import DonutChart from '../AllCharts/apex/dountchart';
import StackedBarChart from '../AllCharts/apex/stackedbarchart';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

function Apexchart() {
  return (
    <div className="page-content">
      <MetaTags>
        <title>Apex Charts | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <div className="container-fluid">
        <Breadcrumbs maintitle="Veltrix" title="Charts" breadcrumbItem="Apex Charts" />

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Line Chart</h4>
                <LineApexChart />
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Bar Chart</h4>
                <BarApexChart />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Area Chart</h4>

                <AreaChart />
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Donut Chart</h4>

                <DonutChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Card>
              <CardBody>
                <h4 className="card-title mb-4">Stacked bar Chart</h4>

                <StackedBarChart />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Apexchart;
