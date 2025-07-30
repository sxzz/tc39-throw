import { babelParse, getLang } from 'ast-kit'
import { walk } from 'estree-walker'
import { generateTransform, MagicStringAST } from 'magic-string-ast'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import type { Codes } from 'ts-macro'

export function transformThrowOperator(
  code: string,
  id: string,
  s: MagicStringAST | Codes,
  volar?: boolean,
): void {
  const ast = babelParse(code, getLang(id), {
    sourceType: 'module',
    plugins: ['throwExpressions'],
  })

  walk(ast as any, {
    enter(node: any) {
      if (node.type === 'UnaryExpression' && node.operator === 'throw') {
        const argumentStart = node.argument.start

        s.replaceRange(
          node.start,
          argumentStart,
          `(function (e)${volar ? ': never' : ''} { throw e })(`,
        )
        s.replaceRange(node.argument.end, node.end, ')')
      }
    },
  })
}

const unplugin: UnpluginInstance<{} | undefined, false> = createUnplugin(() => {
  return {
    name: 'tc39-throw',
    enforce: 'pre',
    transform: {
      filter: {
        code: /\bthrow\b/,
        id: {
          include: /\.[cm]?[jt]sx?$/,
          exclude: /node_modules/,
        },
      },
      handler(code, id) {
        const s = new MagicStringAST(code)
        transformThrowOperator(code, id, s)
        return generateTransform(s, id)
      },
    },
  }
})

export default unplugin
