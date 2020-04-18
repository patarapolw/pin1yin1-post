import { FastifyInstance } from 'fastify'
import swagger from 'fastify-oas'

import libRouter from './lib'
import vocabRouter from './vocab'

export default (f: FastifyInstance, _: any, next: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    f.register(swagger, {
      routePrefix: '/doc',
      swagger: {
        info: {
          title: 'Swagger API',
          version: '0.1.0'
        },
        consumes: ['application/json'],
        produces: ['application/json'],
        servers: [{
          url: 'https://pin1yin1-post.herokuapp.com/api',
          description: 'Optional server description, e.g. Main (production) server'
        }]
      }
    })
  }

  f.register(libRouter, { prefix: '/lib' })
  f.register(vocabRouter, { prefix: '/vocab' })

  next()
}
