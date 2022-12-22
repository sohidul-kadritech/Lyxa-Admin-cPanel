import React, { useState } from "react"
import PropTypes from 'prop-types'
import { Link, useHistory } from "react-router-dom"
import { Row, Col, BreadcrumbItem, Dropdown, DropdownToggle, DropdownItem, DropdownMenu, Modal, } from "reactstrap"

import { useDispatch, useSelector } from 'react-redux'
import { removeAllSelectedGalleryImage } from "../../store/action/galleryAction"
import FormUpload from "../../pages/Forms/FormUpload"


const BreadcrumbGallery = props => {
  const route = useHistory()
  const [setting_Menu, setsetting_Menu] = useState(false)


  const dispatch = useDispatch()
  const { selectedImages } = useSelector(state => state.galleryReducer)



  return (
    <Row className="align-items-center">
      <Col sm={6}>
        <div className="page-title-box">
          <h4 className="font-size-18">{props.breadcrumbItem}</h4>
          <ol className="breadcrumb mb-0">
            {
              (props.maintitle) ?
                <>
                  <BreadcrumbItem>
                    <Link to="/#">{props.maintitle}</Link>
                  </BreadcrumbItem>
                </> : ''
            }

            {
              props.title && <BreadcrumbItem>
                <Link to="/#">{props.title}</Link>
              </BreadcrumbItem>
            }


            <BreadcrumbItem active>
              {props.breadcrumbItem}
            </BreadcrumbItem>
          </ol>
        </div>
      </Col>
      <Col sm={6}>


        <div className="d-flex justify-content-between align-items-center">


          <div></div>


          <div>
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={() => props.setmodal_fullscreen(true)}
              style={{ height: '40px' }}>
              Upload Files
            </button>

            {selectedImages.length > 0 && <button
              type="button"
              className="btn btn-danger waves-effect waves-light mx-2"
              onClick={() => {

                dispatch(removeAllSelectedGalleryImage())

              }}
              style={{ height: '40px' }}>
              <i className="fas fa-remove"></i> Clear All
            </button>}

          </div>


          {/* <form className="app-search d-lg-block" style={{ maxWidth: '300px' }}>
            <div className="position-relative">
              <input type="text" className="form-control" placeholder="Search..." />
              <span className="fa fa-search cursor-pointer"></span>
            </div>
          </form> */}








        </div>


        {/* {
          props.hideSettingBtn === true ? <div></div> : <div className="float-end d-none d-md-block">
            <Dropdown
              isOpen={setting_Menu}
              toggle={() => {
                setsetting_Menu(!setting_Menu)
              }}
            >
              <DropdownToggle color="primary" className="btn btn-primary dropdown-toggle waves-effect waves-light">
                <i className="mdi mdi-cog me-2"></i> Settings
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem tag="a" href="#">Action</DropdownItem>
                <DropdownItem tag="a" href="#">Another action</DropdownItem>
                <DropdownItem tag="a" href="#">Something else here</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag="a" href="#">Separated link</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        } */}


      </Col>

    </Row>


  )

}



BreadcrumbGallery.propTypes = {
  breadcrumbItem: PropTypes.string,
  title: PropTypes.string
}

export default BreadcrumbGallery
