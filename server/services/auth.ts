import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTstrategy, ExtractJwt } from 'passport-jwt'

import UserModel, { User } from '../models/user'

passport.use(
  'signup',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      if (!email || !password) {
        return done({ status: 400, message: 'Email and password not provided' })
      }

      try {
        const existingUser = await UserModel.findOne({ email })
        if (existingUser) {
          return done({ status: 400, message: 'Email in use' })
        }
        const user = await UserModel.create({ email, password } as User)

        return done(null, user)
      } catch (error) {
        return done({ message: error.message })
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
      try {
        const user = (await UserModel.findOne({
          email: email.toLowerCase(),
        })) as User

        if (!user) {
          return done({ status: 404, message: 'User not found' })
        }

        const isValidPassword = await user.isValidPassword(password)

        if (!isValidPassword) {
          return done({ status: 400, message: 'Password does not match' })
        }

        return done(null, user)
      } catch (error) {
        return done({ message: error.message })
      }
    }
  )
)

passport.use(
  new JWTstrategy(
    {
      // secretOrKey: process.env?.TOKEN_SECRET || 'SECRET',
      secretOrKey: 'SECRET',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (token, done) => {
      try {
        return done(null, token.user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

export default passport
