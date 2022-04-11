import React, { useEffect, useState } from 'react';
import { Container, Row } from 'reactstrap';
import { Editor } from 'react-draft-wysiwyg';
import { convertToHTML } from 'draft-convert';
import DOMPurify from 'dompurify';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState,ContentState, convertToRaw } from 'draft-js';
const Texteditor = () => {

    const [editorState, setEditorState] = useState(
        () => EditorState.createEmpty(),
    );
    const [convertedContent, setConvertedContent] = useState(null);



    useEffect(() => {
       console.log(convertedContent);
    }, [convertedContent]);

    const handleEditorChange = (state) => {
        setEditorState(state);
        convertContentToHTML();
    }
    const convertContentToHTML = () => {
        let currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
        setConvertedContent(currentContentAsHTML);
    }
    const createMarkup = (html) => {
        return {
            __html: DOMPurify.sanitize(html)
        }
    }


    return <React.Fragment>

        <div className="page-content">

            <Container fluid={true}>

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
    </React.Fragment>;
};

export default Texteditor;
