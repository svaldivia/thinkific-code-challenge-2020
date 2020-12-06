import { Router } from 'express'
import jwt from 'jsonwebtoken'
import AuthorizationService from '../services/auth'

import UserModel, { User } from '../models/user'

const router = Router()

router.post(
  '/signup',
  AuthorizationService.authenticate('signup', { session: false }),
  (req, res, next) => {
    const user = req?.user as User
    if (!user) {
      return next({
        message: 'User Not Created',
      })
    }

    res.json({
      user,
    })
  }
)

router.post(
  '/login',
  AuthorizationService.authenticate('login', { session: false }),
  (req, res, next) => {
    const user = req?.user as User
    if (!user) {
      return next({
        status: 404,
        message: 'User Not Found',
      })
    }

    const body = { _id: user._id, email: user.email }
    // Added expiration of 5min to test jwt validation
    const token = jwt.sign({ user: body }, 'SECRET', { expiresIn: '5m' })

    res.json({ token })
  }
)

router.get(
  '/current',
  AuthorizationService.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const tokenUser = req.user as User
    try {
      const user = (await UserModel.findById(tokenUser._id)) as User
      if (!user) {
        return next({ status: 404, message: 'User Not Found' })
      }

      return res.json({
        count: user.count,
      })
    } catch (error) {
      return next({ message: error.message })
    }
  }
)

router.get(
  '/next',
  AuthorizationService.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const tokenUser = req.user as User
    try {
      let user = (await UserModel.findById(tokenUser._id)) as User
      if (!user) {
        return next({ status: 404, message: 'User Not Found' })
      }

      user.count++
      user = await user.save()

      return res.json({
        count: user.count,
      })
    } catch (error) {
      return next({ message: error.message })
    }
  }
)

router.put(
  '/reset',
  AuthorizationService.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    const tokenUser = req.user as User
    const { count: newCount } = req.body
    if (isNaN(newCount) || newCount < 0 || newCount % 1 !== 0) {
      return next({
        status: 400,
        message: 'Count needs to be a non-negative number',
      })
    }
    try {
      const user = (await UserModel.findByIdAndUpdate(
        tokenUser._id,
        {
          count: Number(newCount),
        },
        { new: true }
      )) as User
      if (!user) {
        return next({ status: 404, message: 'User Not Found' })
      }

      return res.json({
        count: user.count,
      })
    } catch (error) {
      return next({ message: error.message })
    }
  }
)

export default router
