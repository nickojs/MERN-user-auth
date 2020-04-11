const express = require('express'),
  bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res, next) => {
  res.send({ message: 'root route' });
});

//error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.send({ error: err.message });
});

app.listen(5000);
