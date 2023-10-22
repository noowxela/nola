import bcrypt from 'bcryptjs';
import {mongoose} from '../../mongoose.js';


const { Schema } = mongoose

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      maxlength: 15,
      index: {
        unique: true,
        partialFilterExpression: { username: { $type: 'string' } }
      }
    },
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone_number: { type: String, index: true },
    device_token: { type: String, default: null },
    role: { type: String, default: 'customer' },
    current_location: { type: String, default: '' },
    tier: { type: String, default: 'tier1' },
    archive: { type: Date, default: null },
    locale: String,
    account: {
      verification: {
        verified: {
          type: Boolean,
          default: false
        },
        token: String,
        expiresIn: Date
      },
      resetPassword: {
        token: String,
        expiresIn: Date
      }
    }
  },
  { timestamps: true }
)

userSchema.statics.emailExist = function (email) {
  return this.findOne({ email })
}

userSchema.statics.phoneExist = function (phone_number) {
  return this.findOne({ phone_number })
}

userSchema.statics.usernameExist = function (username) {
  return this.findOne({ username })
}
userSchema.statics.managementLogin = function (username) {
  return this.findOne({ username, $or: [{ role: 'admin' }, { role: 'manager' }] })
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

const User = mongoose.model('User', userSchema)
export { User }