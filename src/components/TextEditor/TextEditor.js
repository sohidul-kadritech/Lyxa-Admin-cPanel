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
import {
  getTermAndCondition,
  updateTermAndCondition,
} from "../../store/termsAndConditions/termsAndConditionAction";
import { GET_CONDITION } from "../../network/Api";

const TextEditor = ({ title, type = "" }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { loading, description } = useSelector(
    (state) => state.termsAndConditonReducer
  );

  const [isLoading, setIsLoading] = useState(false);

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  const [condition, setCondition] = useState("");

  useState(() => {
    const callApi = async () => {
      setIsLoading(true);
      try {
        // console.log("call api--------", type);
        const { data } = await requestApi().request(GET_CONDITION, {
          params: {
            type: type,
          },
        });
        if (data.message) {
          const value = data.data;

          if (value != null) {
            const contentBlock = htmlToDraft(value);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const outputEditorState =
                EditorState.createWithContent(contentState);
              setEditorState(outputEditorState);
              setIsLoading(false);
            }
          } else {
            setEditorState(EditorState.createEmpty());
          }
        } else {
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    callApi();
    return () => {
      setEditorState(EditorState.createEmpty()); // This worked for me
    };
  }, []);

  const updateDescription = async (state) => {
    setEditorState(state);
    let currentContentAsHTML = convertToHTML(editorState?.getCurrentContent());
    setCondition(currentContentAsHTML);
  };

  const handleSubmit = () => {
    dispatch(updateTermAndCondition(type, condition));
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
                <div className="d-flex justify-content-between">
                  <CardTitle className="h4">{title}</CardTitle>
                  {isLoading && (
                    <Spinner animation="border" variant="info" size="lg" />
                  )}
                </div>
                <hr />
                <Form>
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
