import React, { useEffect, useState } from "react";
import GlobalWrapper from "../../components/GlobalWrapper";
import { Button, Card, CardBody, CardTitle, Col, Container, Row, Spinner } from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import Breadcrumb from "../../components/Common/Breadcrumb";
import { getAllDatabaseCollections, createDatabaseCollectionBackup } from "../../store/Settings/settingsAction";
import { useDispatch, useSelector } from "react-redux";

const DatabaseSettings = () => {
    const dispatch = useDispatch();
    const { loading, error, databaseCollections } = useSelector((store) => store.settingsReducer);
    const [modifiedDatabaseCollections, setModifiedDatabaseCollections] = useState([]);
    const [selectedCollections, setSelectedCollections] = useState([]);

    // create modified collection data for selection
    const createModifiedDatabaseCollections = (dbCols) => {
        const newCollection = dbCols.map((item) => {
            return { ...item, checked: false, disabled: false };
        });

        return newCollection;
    };

    useEffect(() => {
        dispatch(getAllDatabaseCollections());
    }, []);

    useEffect(() => {
        setModifiedDatabaseCollections(createModifiedDatabaseCollections(databaseCollections));
    }, [databaseCollections]);

    // check / uncheck collection modified object
    const changeModifiedCollection = (checked, fileName) => {
        const newModifiedList = modifiedDatabaseCollections.map((item) => {
            return item.fileName === fileName ? { ...item, checked } : item;
        });

        return newModifiedList;
    };

    // handle single collection selection
    const handleCollectionSelect = (checked, fileName) => {
        if (checked) {
            setSelectedCollections((prev) => prev.concat(fileName));
        } else {
            const newSelectedList = selectedCollections.filter((item) => item !== fileName);
            setSelectedCollections(newSelectedList);
        }

        const newModifiedList = changeModifiedCollection(checked, fileName);
        setModifiedDatabaseCollections(newModifiedList);
    };

    // handle all selection
    const handleCollectionSelectAll = (checked) => {
        if (checked) {
            const newSelectedCollections = [];
            const newModifiedList = [];

            modifiedDatabaseCollections.forEach((item) => {
                newSelectedCollections.push(item.fileName);
                newModifiedList.push({ ...item, checked: true, disabled: true });
            });

            setModifiedDatabaseCollections(newModifiedList);
            setSelectedCollections(newSelectedCollections);
        } else {
            const newModifiedList = modifiedDatabaseCollections.map((item) => ({
                ...item,
                checked: false,
                disabled: false,
            }));

            setModifiedDatabaseCollections(newModifiedList);
            setSelectedCollections([]);
        }
    };

    return (
        <React.Fragment>
            <GlobalWrapper>
                <div className="page-content">
                    <Container fluid>
                        <Breadcrumb
                            maintitle="Drop"
                            breadcrumbItem="Database Collection"
                            title="Admin"
                            loading={loading}
                        />
                        <Card>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col md={3} className="text-end" />
                                </Row>
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <CardTitle className="h4">Database Collection</CardTitle>
                                    <div>
                                        <Button
                                            className="btn btn-success"
                                            disabled={selectedCollections < 1 || loading}
                                            onClick={() => {
                                                dispatch(createDatabaseCollectionBackup(selectedCollections));
                                            }}
                                        >
                                            Backup
                                        </Button>
                                    </div>
                                </div>
                                <Table className="table table-hover text-center">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>Size</Th>
                                            <Th>Modify Time</Th>
                                            <Th className="d-flex justify-content-center align-items-center">
                                                <label>
                                                    Select{" "}
                                                    <input
                                                        className="form-check-input cursor-pointer  mt-0 ms-2"
                                                        type="checkbox"
                                                        id="flexCheckDefault"
                                                        onChange={(e) => {
                                                            handleCollectionSelectAll(e.target.checked);
                                                        }}
                                                    />
                                                </label>
                                            </Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {modifiedDatabaseCollections?.map((item, index) => {
                                            return (
                                                <Tr
                                                    key={Math.random() + index}
                                                    className="align-middle"
                                                    style={{
                                                        fontSize: "15px",
                                                        fontWeight: "500",
                                                    }}
                                                >
                                                    <Td className="text-capitalize d-flex align-items-center">
                                                        {item.name}
                                                    </Td>
                                                    <Td className="text-danger">{(item.size / 1000).toFixed(2)} Mb</Td>
                                                    <Td className="text-success">{item.modifyTime}</Td>
                                                    <Td>
                                                        <input
                                                            className="form-check-input cursor-pointer  "
                                                            type="checkbox"
                                                            checked={item?.checked}
                                                            id="flexCheckDefault"
                                                            disabled={item?.disabled}
                                                            onChange={(e) => {
                                                                handleCollectionSelect(e.target.checked, item.fileName);
                                                            }}
                                                        />
                                                    </Td>
                                                </Tr>
                                            );
                                        })}
                                    </Tbody>
                                </Table>
                                {loading && (
                                    <div className="text-center">
                                        <Spinner animation="border" variant="success" />
                                    </div>
                                )}
                                {error && <div className="text-center">{error?.message || "Someting went wrong"}</div>}
                            </CardBody>
                        </Card>
                    </Container>
                </div>
            </GlobalWrapper>
        </React.Fragment>
    );
};

export default DatabaseSettings;
