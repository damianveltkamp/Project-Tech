const express = require('express')
const router = express.Router()
const base = require('../controllers/default.controller')

router.get('/', base.home)


module.exports = router
