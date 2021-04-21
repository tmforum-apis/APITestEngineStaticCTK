const express = require('express');
const router = express.Router();

// Import module required to handle multipart form
var multer = require('multer');

// Setup buffer memory storage for multipart form
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// Require controller modules.
var checkFileController = require('../controllers/checkFileController');

router.post('/checkFile', upload.single('swaggerFile'), checkFileController.checkFileCompliance);

module.exports = router;
