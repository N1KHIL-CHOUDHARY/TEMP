const express = require('express')
const bcrypt = require('bcrypt')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const path = require('path')

const router = express.Router()
const SECRET_KEY = 'hasthisoncoding'

const userFilePath = path.join(__dirname, '../auth.json')
const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'))




router.post('/login', async (req, res) => {
  const { username, password } = req.body

  if (!username || !password)
    return res.status(400).json({ success: false, message: 'Missing fields' })

  if (username !== userData.username)
    return res.status(401).json({ success: false, message: 'Invalid user' })

  const match = await bcrypt.compare(password, userData.password)
  if (!match)
    return res.status(401).json({ success: false, message: 'Invalid password' })

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '2h' })

  return res.json({ success: true, token })
})

module.exports = router
