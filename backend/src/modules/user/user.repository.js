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
    return await User.findOne(filter, projection)
  }

  async findById(id) {
    return await User.findById(id)
  }

  async create(data) {
    return await User.create(data)
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

  async remove(id) {
    return await User.findByIdAndDelete(id)
  }
}

export default new UserRepository()
