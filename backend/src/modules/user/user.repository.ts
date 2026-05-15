import type { FilterQuery, ProjectionType, Types } from 'mongoose'
import User from './user.model.js'
import type { IUser, IUserDocument } from './user.types.js'

interface PaginatedUsers {
  users: IUser[]
  totalElements: number
}

// para os parâmetros de busca
interface FindAllParams {
  page: number
  size: number
  sortField: string
  sortOrder: 1 | -1
}

class UserRepository {
  async findAll({ page, size, sortField, sortOrder }: FindAllParams): Promise<PaginatedUsers> {
    const skip = page * size

    const [users, totalElements] = await Promise.all([
      User.find()
        .sort({ [sortField]: sortOrder }) // Ordenação dinâmica
        .skip(skip)
        .limit(size)
        .lean<IUser[]>(), // retorna dados puros (Plain Old JavaScript Objects)
      User.countDocuments(),
    ])

    return { users, totalElements }
  }

  async findOne(
    filter: FilterQuery<IUserDocument>,
    projection: ProjectionType<IUserDocument> = {},
  ): Promise<IUser | null> {
    return await User.findOne(filter, projection).lean<IUser | null>()
  }

  async findById(id: string | Types.ObjectId): Promise<IUser | null> {
    return await User.findById(id).lean<IUser | null>()
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data)
    return user.toObject() // converte para objeto JS puro
  }

  async update(id: string | Types.ObjectId, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true }).lean<IUser | null>()
  }

  async remove(id: string | Types.ObjectId): Promise<any> {
    return await User.findByIdAndDelete(id).lean<IUser | null>()
  }
}

export default new UserRepository()
