import type { Types } from 'mongoose'
import type { IOtp } from './otp.types.js'
import Otp from './otp.model.js'

class OtpRepository {
  async create(data: Partial<IOtp>): Promise<IOtp> {
    const otp = await Otp.create(data)
    return otp.toObject() // converte para objeto JS puro
  }

  async findById(id: string | Types.ObjectId, type: 'VERIFY' | 'RESET'): Promise<IOtp | null> {
    return await Otp.findOne({ user: id, type, expiresAt: { $gt: Date.now() } }).lean<IOtp | null>()
  }

  async remove(id: string | Types.ObjectId, type: 'VERIFY' | 'RESET'): Promise<any> {
    return await Otp.deleteOne({ user: id, type })
  }
}

export default new OtpRepository()
