import { createPlugin, type PluginReturn } from 'ts-macro'
import { untsx } from '.'

const plugin: PluginReturn<undefined, false> = createPlugin(() => {
  return {
    name: 'tc39-throw',
    resolveVirtualCode({ codes, ast, filePath }) {
      untsx.transform(ast.text, filePath, codes)
    },
  }
})

export default plugin
