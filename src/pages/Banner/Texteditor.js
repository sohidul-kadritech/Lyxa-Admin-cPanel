import DOMPurify from 'dompurify';
import { convertToHTML } from 'draft-convert';
import { EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Container, Row } from 'reactstrap';

function Texteditor() {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [convertedContent, setConvertedContent] = useState(null);

  useEffect(() => {
    console.log(convertedContent);
  }, [convertedContent]);

  const convertContentToHTML = () => {
    const currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    setConvertedContent(currentContentAsHTML);
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html),
  });

  return (
    <div className="page-content">
      <Container fluid>
        <Row>
          <Editor
            editorState={editorState}
            onEditorStateChange={handleEditorChange}
            wrapperClassName="wrapper-class"
            editorClassName="editor-class"
            toolbarClassName="toolbar-class"
          />
          <div className="preview" dangerouslySetInnerHTML={createMarkup(convertedContent)}></div>
        </Row>
      </Container>
    </div>
  );
}

export default Texteditor;
