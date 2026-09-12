import mongoose from 'mongoose'

const roles = ['citizen', 'student', 'faculty', 'industry', 'admin']

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, match: /^\S+@\S+\.\S+$/ },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: roles, default: 'citizen' },
  organization: { type: String, trim: true, maxlength: 120 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

userSchema.methods.toSafeObject = function toSafeObject() {
  return { id: this._id, name: this.name, email: this.email, role: this.role, organization: this.organization, createdAt: this.createdAt }
}

export default mongoose.model('User', userSchema)
