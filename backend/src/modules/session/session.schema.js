import { z } from 'zod'

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Provide a valid e-mail address')
      .nonempty('Email cannot be empty'),

    password: z
      .string({ required_error: 'Password is required' })
      .nonempty('Password cannot be empty'),
  }),
})

export default loginSchema
