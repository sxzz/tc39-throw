import { expect, test } from 'vitest'
import { untsx } from '../src'

const { acorn } = untsx

test('parse simple throw expression', () => {
  const code = 'const a = throw something()'
  const ast = acorn(code, { ecmaVersion: 'latest' })

  const declaration = (ast as any).body[0].declarations[0]
  expect(declaration.init.type).toBe('UnaryExpression')
  expect(declaration.init.operator).toBe('throw')
  expect(declaration.init.prefix).toBe(true)
  expect(declaration.init.argument.type).toBe('CallExpression')
  expect(declaration.init.argument.callee.name).toBe('something')
})
