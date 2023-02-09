import React from 'react';
import MetaTags from 'react-meta-tags';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';

// Import Breadcrumb
import Breadcrumbs from '../../components/Common/Breadcrumb';

// Charts
import Bubble from '../AllCharts/echart/bubblechart';
import Candlestick from '../AllCharts/echart/candlestickchart';
import Doughnut from '../AllCharts/echart/doughnutchart';
import Gauge from '../AllCharts/echart/gaugechart';
import LineBar from '../AllCharts/echart/linebarchart';
import Line from '../AllCharts/echart/linechart';
import Pie from '../AllCharts/echart/piechart';
import Scatter from '../AllCharts/echart/scatterchart';

function EChart() {
  return (
    <div className="page-content">
      <MetaTags>
        <title>ECharts | Veltrix - Responsive Bootstrap 5 Admin Dashboard</title>
      </MetaTags>
      <Container fluid>
        {/* Render Breadcrumb */}
        <Breadcrumbs maintitle="Veltrix" title="Charts" breadcrumbItem="ECharts" />
        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Line Chart</h4>
                <div id="line-chart" className="e-chart">
                  <Line />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Mix Line-Bar</h4>
                <div id="mix-line-bar" className="e-chart">
                  <LineBar />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Doughnut Chart</h4>
                <div id="doughnut-chart" className="e-chart">
                  <Doughnut />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Pie Chart</h4>
                <div id="pie-chart" className="e-chart">
                  <Pie />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Scatter Chart</h4>
                <div id="scatter-chart" className="e-chart">
                  <Scatter />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Bubble Chart</h4>
                <div id="bubble-chart" className="e-chart">
                  <Bubble />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Candlestick Chart</h4>
                <div id="candlestick-chart" className="e-chart">
                  <Candlestick />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6">
            <Card>
              <CardBody>
                <h4 className="mt-0 header-title mb-4">Gauge Chart</h4>
                <div id="gauge-chart" className="e-chart">
                  <Gauge />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default EChart;
