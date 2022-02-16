import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationService } from '../services/facebook-authentication'

export const makeFacebookLoginController = (): FacebookLoginController =>
  new FacebookLoginController(makeFacebookAuthenticationService())
