const userDetails = require('../mongoDB/mongoSchema')
require('dotenv').config()

const smsService = require('twilio')(
  process.env.TWILO_ACCOUNT_SID,
  process.env.TWILO_AUTH_TOKEN
)
const sendOTP = (req, res) => {
  const user = req.body
  smsService.verify
    .services(process.env.TWILO_SERVICE_ID)
    .verifications.create({
      to: user.phoneNumber,
      channel: user.channel,
    })
    .then((data) => {
      res.status(200).json({ status: true, addInfo: 'OTP has been sent' })
    })
    .catch((error) => {
      res.status(500).json({ status: false, addInfo: 'Please check network' })
    })
}

const checkOTP = (req, res) => {
  const user = req.body

  smsService.verify
    .services(process.env.TWILO_SERVICE_ID)
    .verificationChecks.create({
      to: user.phoneNumber,
      code: user.code,
    })
    .then((data) => {
      if (data.valid) {
        res.status(200).json({ status: true, addInfo: 'Code accepted' })
      } else {
        res.status(401).json({
          status: false,
          msg: 'Incorrect OTP resend OTP after 30s',
        })
      }
    })
    .catch((error) => {
      res.status(500).json({ status: false, addInfo: 'Unable to verify OTP' })
    })
}

const addUser = async (req, res) => {
  const user = req.body
  try {
    const userIn = await userDetails.create({
      phoneNumber: user.phoneNumber,
      location: user.location,
    })
    res.status(201).json({ loginStatus: true })
  } catch (err) {
    console.log(err)
    res.status(500).json({ loginStatus: false, errorMsg: err })
  }
}

module.exports = { sendOTP, checkOTP, addUser }
