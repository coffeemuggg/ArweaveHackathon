const express = require('express');

const app = express();
const port = 8080;

const createPostRoute = require('./create-post');
const getContentRoute = require('./get-content');

app.use(express.json());
app.use('/create-post', createPostRoute);
app.use('/get-content', getContentRoute);

app.get('/', (req, res) => {
  res.send('ARweave hackathon');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
