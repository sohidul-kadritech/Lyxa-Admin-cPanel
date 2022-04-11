import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardTitle,
  Col,
  Container,
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
import { addPolicy } from "./../../store/Policy/policyAction";
import { useDispatch, useSelector } from "react-redux";
import { convertToHTML } from "draft-convert";
import htmlToDraft from "html-to-draftjs";
import requestApi from "../../network/httpRequest";
import { GET_SINGLE_POLICY } from "../../network/Api";

const TextEditor = ({ title, type }) => {
  // console.log("content-----", content);
  const dispatch = useDispatch();

  const { loading, policy } = useSelector((state) => state.policyReducer);

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  const [description, setDescription] = useState("");

  useState(() => {
    const callApi = async () => {
      try {
        // console.log("call api--------", type);
        const { data } = await requestApi().request(GET_SINGLE_POLICY, {
          params: {
            type: type,
          },
        });
        if (data.message) {
          const value = data.data.policies[type];

          if (value != null) {
            const contentBlock = htmlToDraft(value);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const outputEditorState =
                EditorState.createWithContent(contentState);
              setEditorState(outputEditorState);
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
    // console.log("state value---", state);
    setEditorState(state);
    let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    // console.log(currentContentAsHTML);
    setDescription(currentContentAsHTML);
  };

  const handleSubmit = () => {
    const data = {
      type: type,
      value: description,
    };

    dispatch(addPolicy(data));
  };
  return (
    <React.Fragment>
      <GlobalWrapper>
        <div className="page-content">
          <Container fluid={true}>
            <Row>
              <Col>
                <Card>
                  <CardBody>
                    <CardTitle className="h4">{title}</CardTitle>
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
                          <Spinner
                            animation="border"
                            variant="info"
                            size="sm"
                          />
                        ) : (
                          "Submit"
                        )}
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </GlobalWrapper>
    </React.Fragment>
  );
};

export default TextEditor;
