const express = require('express');
const router = express.Router();

router.all('/', (request, response) => {
  console.log('Hit the root');
  response.status(404).send();
});

module.exports = router;
