const express = require('express')
const router = express.Router()
const base = require('../controllers/default.controller')

router.get('/', base.home)
router.get('*', base.notFound)


module.exports = router
