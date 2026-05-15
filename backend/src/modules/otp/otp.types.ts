import { Document, Types } from 'mongoose'

export interface IOtp {
  user: Types.ObjectId
  code: string
  type: 'VERIFY' | 'RESET'
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}

// contém métodos como .save(), .populate(), .isModified()
export interface IOtpDocument extends IOtp, Document {
  _id: Types.ObjectId
}
