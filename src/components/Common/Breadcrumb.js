import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  BreadcrumbItem,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
import { Spinner, Button, Tooltip } from "reactstrap";
import { useHistory } from "react-router-dom";

const Breadcrumb = ({
  breadcrumbItem,
  maintitle,
  title,
  loading,
  callList,
  isRefresh = true,
  isAddNew = false,
  addNewRoute = "",
  params = "",
}) => {
  const history = useHistory();

  const gotoAddNew = () => {
    history.push({
      pathname: `/${addNewRoute}`,
      search: params,
    });
  };

  return (
    <Row className="align-items-center">
      <Col sm={6}>
        <div className="page-title-box">
          <h4 className="font-size-18">{breadcrumbItem}</h4>
          <ol className="breadcrumb mb-0">
            {maintitle ? (
              <>
                <BreadcrumbItem>
                  <Link to="/">{maintitle}</Link>
                </BreadcrumbItem>
              </>
            ) : (
              ""
            )}

            {title && (
              <BreadcrumbItem>
                <span
                  className="cursor-pointer"
                  onClick={() => history.goBack()}
                >
                  {title}
                </span>
              </BreadcrumbItem>
            )}

            <BreadcrumbItem active>
              <span className="font-weight-bold">{breadcrumbItem}</span>
            </BreadcrumbItem>
          </ol>
        </div>
      </Col>

      <Col sm={6} className="d-flex justify-content-end cursor-pointer">
        {isAddNew && (
          <Button className="me-3" onClick={gotoAddNew}>
            Add New
          </Button>
        )}

        {isRefresh && (
          <Button
            variant="primary"
            id="refreshBtn"
            onClick={() => callList(true)}
          >
            {loading ? (
              <Spinner
                animation="border"
                variant="info"
                style={{ width: "20px", height: "20px" }}
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                width="20px"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
          </Button>
        )}
      </Col>
    </Row>
  );
};

Breadcrumb.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string,
};

export default Breadcrumb;
