import  express from 'express';
var app = express();
const server = require('http').Server(app);

import routes from './routes';
import models, { database } from './models';



app.use(express.static('public'));

// app.use('/', routes);
app.use('/data', routes.data);

app.get('/', function (req, res) {
  res.send('Hello World!');
});

database.then(async () => {
  server.listen(39009, function () {
    console.log('Example app listening on port 39009!');
  });
});

