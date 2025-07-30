import { parse as babelParse } from '@babel/parser'
import { walk } from 'estree-walker'

type NodeInfo = [
  code: string,
  start: number,
  end: number,
  start: number,
  end: number,
]

type ParseFn = (src: string, isExpression: boolean) => any

type BuildFn = (start: number, end: number, argument: any) => any

function getRange(node: any) {
  return node.range || [node.start, node.end]
}

export function replace(
  source: string,
  isTS: boolean,
  isJSX: boolean,
  framework: string,
  parse: ParseFn,
  build: BuildFn,
): any {
  const ast = babelParse(source, {
    sourceType: 'module',
    plugins: [
      'throwExpressions',
      ...(isTS ? (['typescript'] as const) : []),
      ...(isJSX ? (['jsx'] as const) : []),
    ],
    errorRecovery: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowImportExportEverywhere: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    allowNewTargetOutsideFunction: true,
    allowYieldOutsideFunction: true,
  })

  let replacedSource = source
  const sources: NodeInfo[] = []

  walk(ast as any, {
    enter(node: any) {
      if (node.type === 'UnaryExpression' && node.operator === 'throw') {
        if (framework === 'eslint-typescript-parser') {
          replacedSource =
            replacedSource.slice(0, node.start) +
            ' '.repeat(node.argument.start - node.start) +
            replacedSource.slice(node.argument.start, node.argument.end) +
            ' '.repeat(node.end - node.argument.end) +
            replacedSource.slice(node.end)
          return
        }

        const valid = source.slice(node.argument.start, node.argument.end)
        sources.push([
          valid,
          node.start,
          node.end,
          node.argument.start,
          node.argument.end,
        ])

        const originalLength = node.end - node.start
        const placeholder = 'x'.repeat(originalLength)

        replacedSource = `${replacedSource.slice(0, node.start)}${placeholder}${replacedSource.slice(node.end)}`
      }
    },
  })

  const finalAST = parse(replacedSource, false)
  if (framework === 'eslint-typescript-parser') {
    return finalAST
  }

  walk(finalAST as any, {
    enter(node) {
      if (['File', 'Program', 'ExpressionStatement'].includes(node.type)) {
        return
      }

      const [start, end] = getRange(node)
      const valid = sources.find(
        ([, _start, _end]) => start === _start && end === _end,
      )
      if (!valid) return

      const newNode = build(start, end, processValid(valid))
      this.replace(newNode)
      this.skip()
    },
  })

  return finalAST

  function processValid(node: NodeInfo): any {
    const [, , , validStart, validEnd] = node

    const valid = sources.find(
      ([, start, end]) => start >= validStart && end <= validEnd,
    )
    if (valid) {
      const validNode = processValid(valid)
      const fullMatch = valid[1] === validStart && valid[2] === validEnd

      if (fullMatch) {
        return build(valid[1], valid[2], validNode)
      } else {
        throw new Error('Unsupported syntax')
      }
    } else {
      const ast = parse(node[0], true)

      ast.range = [validStart, validEnd]
      ast.start = validStart
      ast.end = validEnd

      return ast
    }
  }
}

export function buildThrowOperator(
  start: number,
  end: number,
  argument: any,
): any {
  return {
    type: 'UnaryExpression',
    operator: 'throw',
    argument,
    prefix: true,
    start,
    end,
    range: [start, end],
  }
}
