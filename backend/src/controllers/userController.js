import Joi from '@hapi/joi'
import bcrypt from 'bcrypt'
import { User } from '../db/models'
import { Op } from 'sequelize'
import jwt from 'jsonwebtoken'

const registerSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
})

const register = async (req, res) => {
  const { email, password, username } = req.body

  const result = Joi.validate({ email, password, username }, registerSchema)

  if (result.error) {
    return res.status(400).json({ message: result.error.message })
  }
  // Check if a user with the provided email or username already exists
  const existingUser = await User.findOne({
    where: {
      [Op.or]: [{ email }, { username }],
    },
  })

  if (existingUser) {
    return res
      .status(400)
      .json({ message: 'A user with that email or username already exists' })
  }
  try {
    // Hash the user's password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
    })
    return res.status(201).json({ message: 'User created successfully', user })
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body

  try {
    // Find the user with the matching username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: username }, { username }],
      },
    })

    // If no user was found, return an error
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // Compare the provided password with the user's hashed password
    const isMatch = await bcrypt.compare(password, user.password)

    // If the passwords don't match, return an error
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' })
    }

    // If the passwords match, create a JSON web token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET
    )

    // Return the user information and JSON web token in the response
    return res.status(200).json({
      message: 'login was successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
      },
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

export { register, login }
