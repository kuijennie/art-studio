import mongoose, { Schema, type Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  fullname: string
  email: string
  password: string
  role: 'customer' | 'admin'
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
  comparePassword(plain: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    fullname:  { type: String, required: true, maxlength: 100, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['customer', 'admin'], default: 'customer' },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
)

UserSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

UserSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)
