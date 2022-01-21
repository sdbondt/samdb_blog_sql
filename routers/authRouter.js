const express = require('express')
const {  signUp, login, getProfile } = require('../controllers/authController')
const auth = require('../utils/auth')
const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login)
router.get('/profile', auth, getProfile)

module.exports = router