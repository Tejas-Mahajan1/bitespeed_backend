const express = require('express');
const ContactController = require('../controllers/contactController');

const router = express.Router();

router.post('/identify', ContactController.identify);

module.exports = router; 