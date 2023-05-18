const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

var server = app.listen(port, () => {
    console.log('Server started on: ' + port);
  });

  app.get('/', (req, res) => {
    res.send("is Dead, Error 404");
  });