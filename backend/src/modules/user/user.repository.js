import User from '../user/user.model.js'

class UserRepository {
  async findAll({ page, size, sortField, sortOrder }) {
    const skip = page * size

    const [users, totalElements] = await Promise.all([
      User.find()
        .sort({ [sortField]: sortOrder }) // Ordenação dinâmica
        .skip(skip)
        .limit(size)
        .lean(), // retorna dados puros (Plain Old JavaScript Objects)
      User.countDocuments(),
    ])

    return { users, totalElements }
  }

  async findOne(filter, projection = {}) {
    return await User.findOne(filter, projection).lean()
  }

  async findById(id) {
    return await User.findById(id).lean()
  }

  async create(data) {
    const user = await User.create(data)
    return user.toObject() // converte para objeto JS puro
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).lean()
  }

  async remove(id) {
    return await User.findByIdAndDelete(id).lean()
  }
}

export default new UserRepository()
