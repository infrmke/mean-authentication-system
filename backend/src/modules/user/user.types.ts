import { Document, Types } from 'mongoose'

export interface IUser {
  name: string
  email: string
  password?: string
  isAccountVerified: boolean
  createdAt?: Date
  updatedAt?: Date
}

// contém métodos como .save(), .populate(), .isModified()
export interface IUserDocument extends IUser, Document {
  _id: Types.ObjectId
}
