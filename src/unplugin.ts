import { generateTransform, MagicStringAST } from 'magic-string-ast'
import { createUnplugin, type UnpluginInstance } from 'unplugin'
import { untsx } from '.'

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
        untsx.transform(code, id, s)
        return generateTransform(s, id)
      },
    },
  }
})

export default unplugin
