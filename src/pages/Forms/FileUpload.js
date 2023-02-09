import axios from 'axios';
import React, { useRef, useState } from 'react';
import { Button } from 'reactstrap';

function FileUpload() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState('');

  const saveFile = (e) => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('fileName', fileName);

    const response = await fetch('http://localhost:1000/api/upload/image/single', {
      method: 'POST',
      body: formData,
    });

    console.log(await response.json());
  };

  // eslint-disable-next-line no-unused-vars
  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer,
      //* no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin,
      // strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  // eslint-disable-next-line no-unused-vars
  const requestSend = async () => {
    // eslint-disable-next-line no-unused-vars
    const bodyData = {
      imagesList: [
        {
          name: 'DataTypes.STRING',
          folder: 'DataTypes.STRING',
          path: 'DataTypes.STRING',
          size: 'DataTypes.INTEGER',
        },
      ],
    };

    const responseData = await fetch('http://localhost:5000/api/v1/admin/image-folder/', {
      method: 'GET',
    });

    // const responseData = await postData(IMAGE_UPLOAD, bodyData)

    console.log('====================================');
    console.log('responseData', responseData);
    console.log('====================================');
  };

  const resRef = useRef();

  const clickLisener = () => {
    axios
      .get('https://jsonplaceholder.typicode.com/posts')
      .then((response) => {
        // handle success
        console.log(response);
        resRef.current.innerHTML = JSON.stringify(response.data);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .then(() => {
        // always executed
      });
  };

  return (
    <div className="page-content">
      <div className="App">
        <input type="file" onChange={saveFile} />
        <button type="button" onClick={uploadFile}>
          Upload
        </button>
      </div>

      <div>
        <br />
        <br />
        <br />

        <Button color="primary" onClick={clickLisener}>
          axios Request
        </Button>
        <p ref={resRef}></p>
      </div>
    </div>
  );
}

export default FileUpload;
