import logo from './logo.svg';
import './App.css';
import { useRef } from 'react';
const axios = require('axios');
function App() {

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
    <div className="App">

      <button onClick={clickLisener}>Call</button>
      <p ref={resRef}></p>

    </div>
  );
}

export default App;
