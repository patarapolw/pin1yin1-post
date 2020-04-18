import { FastifyInstance } from 'fastify'
import sqlite3 from 'better-sqlite3'
import pinyin from 'chinese-to-pinyin'

export default (f: FastifyInstance, _: any, next: () => void) => {
  const zh = sqlite3('assets/zh.db')
  const stmt = {
    vocabMatch: zh.prepare(`
    SELECT simplified, pinyin, english FROM vocab 
    WHERE
      simplified = ? OR
      traditional = ?`)
  }

  f.post('/match', {
    schema: {
      tags: ['vocab'],
      summary: 'Get translation for a given vocab',
      body: {
        type: 'object',
        required: ['entry'],
        properties: {
          entry: { type: 'string' }
        }
      }
    }
  }, async (req) => {
    const { entry } = req.body

    return {
      result: stmt.vocabMatch.get(entry, entry) || {
        simplified: entry,
        pinyin: pinyin(entry, { keepRest: true })
      }
    }
  })

  next()
}
