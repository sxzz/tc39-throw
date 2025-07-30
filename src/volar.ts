import { createPlugin, type PluginReturn } from 'ts-macro'
import { transformThrowOperator } from './unplugin'

const plugin: PluginReturn<undefined, false> = createPlugin(() => {
  return {
    name: 'tc39-throw',
    resolveVirtualCode({ codes, ast, filePath }) {
      if (!/\bthrow\b/.test(ast.text)) return
      transformThrowOperator(ast.text, filePath, codes, true)
    },
  }
})

export default plugin
