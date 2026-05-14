import Otp from './otp.model.js'

class OtpRepository {
  async create(data) {
    return await Otp.create(data).toObject()
  }

  async findById(id, type) {
    return await Otp.findOne({ user: id, type, expiresAt: { $gt: Date.now() } }).lean()
  }

  async remove(id, type) {
    return await Otp.deleteOne({ user: id, type })
  }
}

export default new OtpRepository()
