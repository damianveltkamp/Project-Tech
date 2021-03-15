const express = require('express');

const port = 3000,
  app = express();

app.get('/', (req, res) => {
  res.send('hey');
});

app.listen(port, () => console.log(`Using port: ${port}`));
