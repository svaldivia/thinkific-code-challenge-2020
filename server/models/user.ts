import { model, Schema, Document } from 'mongoose'
import bcrypt from 'bcrypt'

const saltDefault = 10

export interface User extends Document {
  _id: string
  email: string
  password: string
  count: number
  isValidPassword(password: string): boolean
}

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    min: 0,
    default: 0,
  },
})

UserSchema.pre<User>('save', async function (next) {
  const user = this

  if (!user.isModified('password')) {
    return next(null)
  }

  try {
    const salt = await bcrypt.genSalt(saltDefault)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash
    next(null)
  } catch (error) {
    next(error)
  }
})

UserSchema.methods.isValidPassword = async function (
  candidatePassword: string
): Promise<boolean | Error> {
  const user = this
  try {
    const compare = await bcrypt.compare(candidatePassword, user.password)
    return compare
  } catch (error) {
    return error
  }
}

export default model('User', UserSchema)
