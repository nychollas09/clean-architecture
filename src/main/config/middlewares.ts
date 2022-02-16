import express, { Express } from 'express'

export const setupMiddlewares = (app: Express): void => {
  app.disable('x-powered-by')

  app.use((_, response, next) => {
    response.set('access-control-allow-origin', '*')
    response.set('access-control-allow-methods', '*')
    response.set('access-control-allow-headers', '*')
    next()
  })

  app.use((_, response, next) => {
    response.type('json')
    next()
  })

  app.use(express.json())
}
