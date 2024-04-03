const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/*', (req, res) => {
  const path = req.path;
  console.log(path);

  const url = req.url;
  console.log(url);

  const query = req.query;
  console.log(query);

  res.type('html').send(`
    <h1>URL: ${url}</h1>
    <a href=${url}>${url}</a>
  `)
})

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
})