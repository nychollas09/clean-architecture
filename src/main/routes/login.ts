import { Router, Response } from 'express'

export default (router: Router): void => {
  router.post('/api/login/facebook', (_, response: Response) => {
    response.json({ data: 'any_data' })
  })
}
