import { createUntsx, REGEX_TS, type UntsxInstance } from 'untsx'
import type { Node } from '@babel/types'
import type { MagicStringAST } from 'magic-string-ast'
import type { AstPath, Doc, ParserOptions } from 'prettier'
import type { Codes } from 'ts-macro'

export const untsx: UntsxInstance = createUntsx({
  baseParser: {
    name: 'babel',
    parserOptions: {
      plugins: ['throwExpressions'],
    },
  },
  isTarget(node: Node): boolean {
    return node.type === 'UnaryExpression' && node.operator === 'throw'
  },
  build(parserName: string, start: number, end: number, valid: any) {
    return {
      type: 'UnaryExpression',
      operator: 'throw',
      prefix: true,
      argument: valid,
      start,
      end,
      range: [start, end],
    }
  },

  shouldTransform: (code) => /\bthrow\b/.test(code),
  transform(
    code: string,
    id: string,
    s: MagicStringAST | Codes,
    node: any,
  ): boolean {
    const argumentStart = node.argument.start

    s.replaceRange(
      node.start,
      argumentStart,
      `(function (e)${REGEX_TS.test(id) ? ': never' : ''} { throw e })(`,
    )
    s.replaceRange(node.argument.end, node.end, ')')

    return true
  },
  format(
    path: AstPath<any>,
    options: ParserOptions<any>,
    print: (path: AstPath<any>) => Doc,
  ): Doc {
    const needsRootParens = path.parent.type === 'MemberExpression'
    const needParens = ['UnaryExpression', 'ObjectExpression'].includes(
      path.node.argument.type,
    )
    return [
      needsRootParens ? '(' : '',
      'throw ',
      needParens ? '(' : '',
      path.call(print, 'argument'),
      needParens ? ')' : '',
      needsRootParens ? ')' : '',
    ]
  },
})
