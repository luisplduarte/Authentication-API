const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Users = require('../models/userModel')

const router = express.Router();

/**
 * Login route
 */
router.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await Users.findOne({ username: username })
  if (!user) return res.status(400).json({ success: false })

  // Check if password is correct
  const isMatch = await user.isValidPassword(password)
  if (isMatch) {
    const payload = {
      id: user._id.toString(),
      username: user.username
    };

    // Generate JWT token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        res.json({
          success: true,
          token: 'Bearer ' + token
        });
      }
    )
  } else {
    return res.status(400).json({ success: false })
  }
})

/* Sign up route */
router.post('/signup', async (req, res) => {
  const { username, password } = req.body
  const user = await Users.findOne({ username: username })
  if (user) {
    return res.status(400).json({ success: false })
  } else {
    const newUser = new Users({
      username: username,
      password: password
    })

    newUser.save()
      .then(user => res.sendStatus(201))
      .catch(err => {console.log(err); return res.status(400).json({ success: false })} )
  }
})

/**
 * Test route to check if user is logged in.
 * Returns current user if logged in or unauthorized response if not
 */
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
  })
})

module.exports = router;