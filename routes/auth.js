const express = require('express');
const router = express.Router();
const User = require('../models/User');
const generateOtp = require('../otp');
const mailjet =  require('node-mailjet').connect()