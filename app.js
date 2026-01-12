const express = require('express')
const router = express()

router.use('/auth', require('./Route/userRouter'))
router.use('/Mood', require('./Route/moodRouter'))
router.use('/Song', require('./Route/songRouter'))

module.exports = router
