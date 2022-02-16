import { adaptExpressRoute } from '@/infrastructure/adapters'
import { Router } from 'express'
import { makeFacebookLoginController } from '../factories/controllers'

export default (router: Router): void => {
  router.post(
    '/api/login/facebook',
    adaptExpressRoute(makeFacebookLoginController())
  )
}
