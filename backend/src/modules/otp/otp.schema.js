import z from 'zod'
import handleValidation from '../../middlewares/handleValidation.js'
import { idSchema } from '../../utils/common.schema.js'

// REGRAS individuas de base
const emailRule = z
  .string({ required_error: 'Email is required.' })
  .trim()
  .toLowerCase()
  .email('Provide a valid e-mail address.')

const otpRule = z.string({ required_error: 'OTP is required.' }).nonempty('OTP cannot be empty.')

// SCHEMAS

// POST /otps/email-verification/check/:id
const checkVerificationSchema = z.object({
  params: z.object({ id: idSchema }),
  body: z.object({ otp: otpRule }),
})

// POST /otps/password-reset/request
const requestResetSchema = z.object({
  body: z.object({ email: emailRule }),
})

// POST /otps/password-reset/check
const checkResetSchema = z.object({
  body: z.object({
    email: emailRule,
    otp: otpRule,
  }),
})

// PATCH /password-reset
const resetPasswordSchema = z.object({
  body: z
    .object({
      email: emailRule,
      new_password: z.string().min(8, 'Password must be at least 8 characters.'),
      confirm_password: z.string().nonempty('Confirm your password.'),
    })
    .refine((data) => data.new_password === data.confirm_password, {
      message: 'Passwords must match each other.',
      path: ['confirm_password'], // erro associado ao campo confirm_password
    }),
})

// POST /otps/resend
const resendOtpSchema = z.object({
  body: z
    .object({
      type: z
        .string({
          error: (issue) => {
            if (issue.input === undefined || typeof issue.input !== 'string') {
              return { message: 'Type is required.' }
            }
          },
        })
        .min(1, 'Type is required.')
        .refine((val) => ['VERIFY', 'RESET'].includes(val), {
          message: 'Invalid OTP type.',
        }),
      email: emailRule.optional(), // o e-mail apenas é necessário no resend de RESET
    })
    .refine(
      (data) => {
        if (data.type === 'RESET') {
          const emailResult = z.string().email().safeParse(data.email)
          return emailResult.success // se o e-mail não for válido, retorna false
        }

        return true
      },
      {
        message: 'Provide a valid e-mail address for password reset.',
        path: ['email'], // erro associado ao campo email
      },
    ),
})

export {
  checkVerificationSchema,
  requestResetSchema,
  checkResetSchema,
  resetPasswordSchema,
  resendOtpSchema,
}
