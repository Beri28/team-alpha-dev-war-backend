import {Router} from 'express'
import { Login, Logout, Signup } from '../controller/auth.controller.js'

const authRouter = Router()

authRouter.post('/signup', Signup)
authRouter.post('/login', Login)
authRouter.post('/logout', Logout)





export default authRouter