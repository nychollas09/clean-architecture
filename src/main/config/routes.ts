import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

const routesDir = resolve(__dirname, '..', 'routes')

export const setupRoutes = (app: Express): void => {
  const router = Router()

  readdirSync(routesDir)
    .filter((fileName) => !fileName.endsWith('.map'))
    .map(async (fileName) => {
      ;(await import(`${routesDir}/${fileName}`)).default(router)
    })

  app.use('/api', router)
}
