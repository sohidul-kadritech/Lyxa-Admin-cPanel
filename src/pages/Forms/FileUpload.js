import React, { useState,useRef } from 'react'
import axios from 'axios';
import { Button } from 'reactstrap';
import ApiClient from '../../network/ApiClient';
import { IMAGE_UPLOAD } from '../../network/Api';

const FileUpload = () => {

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {

        const formData = new FormData();
        formData.append("image", file);
        formData.append("fileName", fileName);


        const response = await fetch("http://localhost:1000/api/upload/image/single", {
            method: 'POST',
            body: formData,
        });

        console.log(await response.json());

        try {
            // const res = await axios.post(
            //     "http://localhost:4005/api/upload/image/single",
            //     formData
            // );
            // console.log(res);
        } catch (e) {
            console.log(e);
            console.log(e.message);
        }
    };


    async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }

    const requestSend = async () => {

        var bodyData = {
            imagesList: [
                {
                    name: "DataTypes.STRING",
                    folder: "DataTypes.STRING",
                    path: "DataTypes.STRING",
                    size: "DataTypes.INTEGER"
                }
            ]
        }

        const responseData = await fetch("http://localhost:5000/api/v1/admin/image-folder/", {
            method: 'GET',
        });

        // const responseData = await postData(IMAGE_UPLOAD, bodyData)
            

       

        console.log('====================================');
        console.log("responseData", responseData);
        console.log('====================================');
    }

    const resRef = useRef()
    
  const clickLisener = () => {
    axios.get('https://jsonplaceholder.typicode.com/posts')
      .then(function (response) {
        // handle success
        console.log(response);
        resRef.current.innerHTML = JSON.stringify(response.data)

      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
  }

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="App">
                    <input type="file" onChange={saveFile} />
                    <button onClick={uploadFile}>Upload</button>
                </div>


                <div>
                    <br />
                    <br />
                    <br />
               
                    <Button color='primary' onClick={clickLisener}>axios Request</Button>
                    <p ref={resRef}></p>
                </div>

            </div>
        </React.Fragment>

    );

}

export default FileUpload;