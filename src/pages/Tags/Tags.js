import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Breadcrumb from "../../components/Common/Breadcrumb";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import {
    Button,
    Card,
    CardBody,
    CardTitle,
    Col,
    Container,
    Label,
    Modal,
    Row,
    Spinner,
} from "reactstrap";
import Select from "react-select";
import {
    activeOptions,
    productStatusOptions,
    shopStatusOptions,
    shopTypeOptions,
    shopTypeOptions2,
    sortByOptions,
} from "../../assets/staticData";
import { successMsg } from "../../helpers/successMsg";
import { useDispatch, useSelector } from "react-redux";
import {
    addTag,
    editTag,
    getAllTags,
    updateShopSearchKey,
    updateShopStatusKey,
    updateShopType,
    updateSortByKey,
} from "../../store/Shop/shopAction";
import Search from "../../components/Search";
import { Tooltip } from "@mui/material";
import AppPagination from "../../components/AppPagination";

const Tags = () => {
    const dispatch = useDispatch();

    const {
        loading,
        tags,
        status,
        searchKey,
        statusKey,
        typeKey,
        sortByKey,
        paging,
        hasNextPage,
        hasPreviousPage,
        currentPage,
    } = useSelector((state) => state.shopReducer);

    const [openModal, setOpenModal] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState({ label: "Select Tag Type", value: "" });
    const [id, setId] = useState(null);
    const [activeStatus, setActiveStatus] = useState({ label: "Select Tag Type", value: "" });

    useEffect(() => {
        dispatch(updateShopType({ label: "All", value: "all" }));
        dispatch(updateShopSearchKey(""));
        dispatch(updateSortByKey({ label: "Desc", value: "desc" }));
        dispatch(updateShopStatusKey({ label: "All", value: "all" }));
        return;
    }, []);

    useEffect(() => {
        if (searchKey || statusKey || typeKey || sortByKey) {
            callTagList(true);
        }
        return;
    }, [searchKey, statusKey, typeKey, sortByKey]);

    const submitTag = () => {
        if (!name) {
            return successMsg("Please Enter  Name", "error");
        }
        if (!type.value) {
            return successMsg("Please Select  Type", "error");
        }
        if (id && !activeStatus.value) {
            return successMsg("Please Select  Type", "error");
        }

        const data = {
            name,
            type: type.value,
        };

        if (id) {
            dispatch(editTag({
                ...data,
                id,
                status: activeStatus?.value
            }));
        } else {
            dispatch(addTag(data));
        }
    };

    const callTagList = (refresh = false) => {
        dispatch(getAllTags(refresh));
    };

    useEffect(() => {
        if (status) {
            setName("");
            setType({ label: "Select Tag Type", value: "" });
            setId(null);
            setActiveStatus('');
            setOpenModal(false);
        }
        return;
    }, [status]);

    // FATCH DATA FOR UPDATE 

    const setUpdateData = (tag) => {
        const findType = shopTypeOptions2.find(item => item?.value === tag.type);
        const findStatus = activeOptions.find(item => item?.value === tag.status);

        setOpenModal(true);
        setId(tag?._id);
        setName(tag?.name);
        setType(findType);
        setActiveStatus(findStatus);

    }

    return (
        <React.Fragment>
            <GlobalWrapper>
                <div className="page-content">
                    <Container fluid={true}>
                        <Breadcrumb
                            maintitle="Lyxa"
                            breadcrumbItem={"Tags"}
                            title="Shop"
                            loading={loading}
                            callList={callTagList}
                        />
                        <Card>
                            <CardBody>
                                <Row>
                                    <Col lg={4}>
                                        <div className="mb-4">
                                            <label className="control-label">Sort By</label>
                                            <Select
                                                palceholder="Select Status"
                                                options={sortByOptions}
                                                classNamePrefix="select2-selection"
                                                value={sortByKey}
                                                onChange={(e) => dispatch(updateSortByKey(e))}
                                            />
                                        </div>
                                    </Col>
                                    <Col lg={4}>
                                        <div className="mb-4">
                                            <label className="control-label">Type</label>
                                            <Select
                                                palceholder="Select Status"
                                                options={shopTypeOptions}
                                                classNamePrefix="select2-selection"
                                                required
                                                value={typeKey}
                                                onChange={(e) => dispatch(updateShopType(e))}
                                                defaultValue={""}
                                            />
                                        </div>
                                    </Col>

                                    <Col lg={4}>
                                        <div className="mb-4">
                                            <label className="control-label">Status</label>
                                            <Select
                                                palceholder="Select Status"
                                                options={productStatusOptions}
                                                classNamePrefix="select2-selection"
                                                required
                                                value={statusKey}
                                                onChange={(e) => dispatch(updateShopStatusKey(e))}
                                                defaultValue={""}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="d-flex justify-content-center">
                                    <Col lg={8}>
                                        <Search
                                            dispatchFunc={updateShopSearchKey}
                                            placeholder="Search by name"
                                        />
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                        <Card>
                            <CardBody>
                                <div className="d-flex justify-content-between align-items-center">
                                    <CardTitle className="h4">Tags</CardTitle>
                                    <Button
                                        className="btn btn-success"
                                        onClick={() => {
                                            setOpenModal(!openModal);
                                            setId(null);
                                            setName('');
                                            setType({ label: 'Select Tag', value: '' })
                                        }}
                                    >
                                        Add New
                                    </Button>
                                </div>
                                <hr />
                                <Table
                                    id="tech-companies-1"
                                    className="table table__wrapper table-striped table-bordered table-hover text-center"
                                >
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Type</Th>
                                            <Th>Status</Th>
                                            <Th>Created At</Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody style={{ position: "relative" }}>
                                        {tags?.map((item, index) => {
                                            return (
                                                <Tr
                                                    key={index}
                                                    className="align-middle"
                                                    style={{
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    <Th>{item?.name}</Th>
                                                    <Th>{item?.type}</Th>
                                                    <Td>{item?.status}</Td>
                                                    <Td>
                                                        {new Date(item?.createdAt).toLocaleDateString()}
                                                    </Td>
                                                    <Td>
                                                        <Tooltip title="Edit">
                                                            <button
                                                                className="btn btn-success me-2 button"
                                                                onClick={() => setUpdateData(item)}
                                                            >
                                                                <i className="fa fa-edit" />
                                                            </button>
                                                        </Tooltip>
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                                {loading && (
                                    <div className="text-center">
                                        <Spinner animation="border" variant="info" />
                                    </div>
                                )}
                                {!loading && tags.length < 1 && (
                                    <div className="text-center">
                                        <h4>No Tag!</h4>
                                    </div>
                                )}
                            </CardBody>
                        </Card>

                        <Row>
                            <Col xl={12}>
                                <div className="d-flex justify-content-center">
                                    <AppPagination
                                        paging={paging}
                                        hasNextPage={hasNextPage}
                                        hasPreviousPage={hasPreviousPage}
                                        currentPage={currentPage}
                                        lisener={(page) =>
                                            dispatch(
                                                getAllTags(
                                                    true,
                                                    null,
                                                    page
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Modal
                    isOpen={openModal}
                    toggle={() => {
                        setOpenModal(!openModal);
                    }}
                    centered={true}
                >
                    <div className="modal-header">
                        <h5 className="modal-title mt-0">{`${id ? 'Edit' : 'Add'}`} Tag</h5>
                        <button
                            type="button"
                            onClick={() => {
                                setOpenModal(false);
                            }}
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-4">
                            <Label>Name</Label>
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Enter Tag Name"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="control-label">Type</label>
                            <Select
                                palceholder="Select type"
                                options={shopTypeOptions2}
                                name="type"
                                classNamePrefix="select2-selection"
                                required
                                value={type}
                                onChange={(e) => setType(e)}
                            />
                        </div>
                        {id && <div className="mb-4">
                            <label className="control-label">Status</label>
                            <Select
                                palceholder="Select Status"
                                options={activeOptions}
                                name="status"
                                classNamePrefix="select2-selection"
                                required
                                value={activeStatus}
                                onChange={(e) => setActiveStatus(e)}
                            />
                        </div>}

                        <Button
                            className="mt-3 px-4"
                            color="success"
                            disabled={loading}
                            onClick={submitTag}
                        >
                            {loading ? (
                                <Spinner animation="border" size='sm' variant="success" />
                            ) : id ? 'Edit' : (
                                "Add"
                            )}
                        </Button>

                    </div>
                </Modal>
            </GlobalWrapper>
        </React.Fragment>
    );
};

const Wrapper = styled.div`
  .heading {
    color: red;
  }
`;

export default Tags;
