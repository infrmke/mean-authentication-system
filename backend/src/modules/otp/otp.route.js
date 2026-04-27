import { Router } from 'express'
import otpController from './otp.controller.js'
import verifyPasswordToken from '../../middlewares/verifyPasswordToken.js'
import handleValidation from '../../middlewares/handleValidation.js'
import { paramsIdSchema } from '../../utils/common.schema.js'
import {
  checkResetSchema,
  checkVerificationSchema,
  requestResetSchema,
  resendOtpSchema,
  resetPasswordSchema,
} from './otp.schema.js'
import { resendOtpFlow } from '../../middlewares/tollPlaza.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route POST /otps/email-verification/:id
router.post(
  '/email-verification/:id',
  handleValidation(paramsIdSchema),
  otpController.requestVerification,
)

// @route POST /otps/email-verification/check/:id
router.post(
  '/email-verification/check/:id',
  handleValidation(checkVerificationSchema),
  otpController.verifyEmail,
)

// @route POST /otps/password-reset/request
router.post(
  '/password-reset/request',
  handleValidation(requestResetSchema),
  otpController.requestReset,
)

// @route POST /otps/password-reset/check
router.post('/password-reset/check/', handleValidation(checkResetSchema), otpController.verifyReset)

//  --- PRIVATE ROUTES ---

// @route GET /otps/password-reset/status
router.get('/password-reset/status', verifyPasswordToken, otpController.show)

// @route PATCH /password-reset
router.patch(
  '/password-reset',
  verifyPasswordToken,
  handleValidation(resetPasswordSchema),
  otpController.resetPassword,
)

// @route POST /otps/resend
router.post('/resend', resendOtpFlow, handleValidation(resendOtpSchema), otpController.resendCode)

export default router
