const express = require('express');
const router = express.Router();

router.all('/', (request, response) => {
  response.status(200).send('OK');
});

module.exports = router;
