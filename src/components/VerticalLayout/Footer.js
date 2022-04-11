import React from "react"
import { Container, Row, Col } from "reactstrap"

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <Container fluid={true}>
          <Row>
            <div className="col-12">
              © Copyright {new Date().getFullYear()} Quicar <span className="d-none d-sm-inline-block"> - All Rights Reserved 
              {" "}<i className="mdi mdi-heart text-danger"></i> by Quicarbd.com .</span>
            </div>
          </Row>
        </Container>
      </footer>
    </React.Fragment>
  )
}

export default Footer
