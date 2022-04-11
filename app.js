const express = require('express');
const path = require('path');
const app = express();
// For Main Server..
const port = process.env.PORT || 4500;


app.use(express.json());


app.use(express.static(__dirname + '/build'));



app.get('*', function (req, res) {
  // Replace the '/dist/<to_your_project_name>/index.html'
  res.sendFile(path.join(__dirname + '/build/index.html'));
});



app.listen(port, () => console.log(`Server is running at port:${port}`));
