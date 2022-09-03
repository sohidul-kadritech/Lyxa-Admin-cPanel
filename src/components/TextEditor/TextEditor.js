import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  Row,
  Spinner,
} from "reactstrap";
import GlobalWrapper from "../GlobalWrapper";
import Breadcrumbs from "../Common/Breadcrumb";
import {
  convertFromRaw,
  convertToRaw,
  ContentState,
  EditorState,
} from "draft-js";

import { useDispatch, useSelector } from "react-redux";
import { convertToHTML } from "draft-convert";
import htmlToDraft from "html-to-draftjs";
import requestApi from "../../network/httpRequest";
import Breadcrumb from "../Common/Breadcrumb";
import {
  getAllAppSettings,
  updateAppSettings,
} from "../../store/Settings/settingsAction";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const TextEditor = ({ title, type = "" }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, appSettingsOptions } = useSelector(
    (state) => state.settingsReducer
  );

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(getAllAppSettings());
  }, []);

  useState(() => {
    // console.log("call", appSettingsOptions);

    if (appSettingsOptions[type]) {
      const contentBlock = htmlToDraft(appSettingsOptions[type]);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const outputEditorState = EditorState.createWithContent(contentState);
        setEditorState(outputEditorState);
      }
    } else {
      history.push("/");
    }

    // return () => {
    //   setEditorState(EditorState.createEmpty());
    // };
  }, []);

  const updateDescription = async (state) => {
    setEditorState(state);
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setDescription(currentContentAsHTML);
  };

  const handleSubmit = () => {
    dispatch(updateAppSettings(type, description));
  };
  return (
    <React.Fragment>
      <GlobalWrapper>
        <Breadcrumb
          maintitle="Drop"
          // title={title}
          breadcrumbItem={title}
          // loading={loading}
          // callList={callDeliveryFee}
          isRefresh={false}
        />

        <Row>
          <Col>
            <Card>
              <CardBody>
                <CardTitle className="h4">{title}</CardTitle>
                <hr />
                <Form method="post">
                  <Editor
                    onEditorStateChange={updateDescription}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState}
                    defaultEditorState={editorState}
                  />
                </Form>

                <div className="button__wrapper py-4 text-center">
                  <Button
                    color="success"
                    onClick={handleSubmit}
                    className="btn btn-md px-5"
                  >
                    {loading ? (
                      <Spinner animation="border" variant="info" size="sm" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default TextEditor;
