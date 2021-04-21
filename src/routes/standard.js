const express = require('express');
const router = express.Router();

router.all('', function (request, response) {
  console.log('Hit the standard');
  response.status(404).send();
});

module.exports = router;
