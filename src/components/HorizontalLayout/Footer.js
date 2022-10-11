import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <div className="col-12">
              <p>
                © {new Date().getFullYear()} LYXA | Developed by{" "}
                <a href="https://www.kadritech.se">Kadritech AB</a> - Powered by
                <a href="https://www.dataholic.info"> Dataholic</a>
              </p>
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
