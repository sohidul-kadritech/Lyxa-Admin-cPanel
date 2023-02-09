import React from 'react';
import { Container, Row } from 'reactstrap';

function Footer() {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <div className="col-12">
            <p>
              © {new Date().getFullYear()} LYXA | Developed by <a href="https://www.kadritech.se">Kadritech AB</a> -
              Powered by
              <a href="https://www.dataholic.info"> Dataholic</a>
            </p>
          </div>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
