import { convertToHTML } from 'draft-convert';
import { ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import React, { useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, CardBody, CardTitle, Col, Form, Row, Spinner } from 'reactstrap';
import GlobalWrapper from '../GlobalWrapper';

import { GET_CONDITION } from '../../network/Api';
import requestApi from '../../network/httpRequest';
import { updateTermAndCondition } from '../../store/termsAndConditions/termsAndConditionAction';
import Breadcrumb from '../Common/Breadcrumb';

function TextEditor({ title, type = '' }) {
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.termsAndConditonReducer);

  const [isLoading, setIsLoading] = useState(false);

  const [editorState, setEditorState] = useState(() => {
    EditorState.createEmpty();
  });

  const [condition, setCondition] = useState('');

  useState(() => {
    const callApi = async () => {
      setIsLoading(true);
      try {
        const { data } = await requestApi().request(GET_CONDITION, {
          params: {
            type,
          },
        });
        if (data.message) {
          const value = data.data;
          setIsLoading(false);
          if (value != null) {
            const contentBlock = htmlToDraft(value);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
              const outputEditorState = EditorState.createWithContent(contentState);
              setEditorState(outputEditorState);
            }
          } else {
            setEditorState(EditorState.createEmpty());
          }
        } else {
          setIsLoading(false);
          console.log(data.error);
        }
      } catch (error) {
        console.log(error);
      }
    };
    callApi();
    return () => {
      setEditorState(EditorState.createEmpty());
    };
  }, []);

  const updateDescription = async (state) => {
    setEditorState(state);
    const currentContentAsHTML = convertToHTML(editorState?.getCurrentContent());
    setCondition(currentContentAsHTML);
  };

  const handleSubmit = () => {
    dispatch(updateTermAndCondition(type, condition));
  };
  return (
    <GlobalWrapper>
      <Breadcrumb
        maintitle="Lyxa"
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
                {isLoading && <Spinner animation="border" color="success" size="lg" />}
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
                  placeholder=" Enter Terms And Conditions"
                />
              </Form>

              <div className="button__wrapper py-4 text-center">
                <Button color="success" onClick={handleSubmit} className="btn btn-md px-5">
                  {loading ? <Spinner animation="border" color="info" size="sm" /> : 'Update'}
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </GlobalWrapper>
  );
}

export default TextEditor;
