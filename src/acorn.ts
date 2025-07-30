import {
  parse as acornParse,
  parseExpressionAt,
  type Options,
  type Program,
} from 'acorn'
import { buildThrowOperator, replace } from './replace'

export function parse(src: string, options: Options): Program {
  return replace(
    src,
    false,
    false,
    'babel',
    (src, isExpression) => {
      let ast = isExpression
        ? parseExpressionAt(src, 0, options)
        : acornParse(src, options)

      return ast
    },
    buildThrowOperator,
  )
}
