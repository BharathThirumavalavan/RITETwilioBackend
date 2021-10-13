const express = require('express');
const router = express.Router();
const {sendOTP,checkOTP,addUser} = require('../controllers/controller')


router.post('/',sendOTP)
router.post('/verify',checkOTP)
router.post('/success',addUser)

module.exports = router; 