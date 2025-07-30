import { format } from 'prettier'
import { expect, test } from 'vitest'
import plugin from '../src/prettier'

test.each(['acorn', 'babel', 'babel-ts'])(
  'prettier formats throw expression with parser %s',
  async (parser) => {
    const code = `
    const x  =  throw  1
    const y  =  throw  x.x
    const z = (throw x.x).x
  `

    const formatted = await format(code, {
      parser,
      plugins: [plugin],
      semi: false,
    })

    expect(formatted).toBe(
      `const x = throw 1
const y = throw x.x
const z = (throw x.x).x
`,
    )
  },
)
