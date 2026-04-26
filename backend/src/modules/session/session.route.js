import { Router } from 'express'

import sessionController from './session.controller.js'
import handleValidation from '../../middlewares/handleValidation.js'
import loginSchema from './session.schema.js'
import verifyAccessToken from '../../middlewares/verifyAccessToken.js'

const router = Router()

//  --- PUBLIC ROUTES ---

// @route POST /sessions/login
router.post('/login', handleValidation(loginSchema), sessionController.authenticate)

// @route POST /sessions/logout
router.post('/logout', sessionController.terminate)

//  --- PRIVATE ROUTES ---

// @route GET /sessions/me
router.get('/me', verifyAccessToken, sessionController.show)

export default router
