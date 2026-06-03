import mongoose, { Schema, type Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  clerkId?: string
  email?: string
  username: string
  password?: string
  lastLogin?: Date
  comparePassword(plain: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    clerkId:   { type: String, unique: true, sparse: true },
    email:     { type: String },
    username:  { type: String, required: true, unique: true, maxlength: 100 },
    password:  { type: String, maxlength: 100 },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
)

// Hash password before saving (only for manual users with a password)
UserSchema.pre('save', async function () {
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

UserSchema.methods.comparePassword = function (plain: string) {
  return bcrypt.compare(plain, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)
