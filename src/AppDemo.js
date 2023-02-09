import { useRef } from 'react';
import './App.css';

const axios = require('axios');

function App() {
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
    <div className="App">
      <button type="button" onClick={clickLisener}>
        Call
      </button>
      <p ref={resRef}></p>
    </div>
  );
}

export default App;
