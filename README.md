# tc39-throw

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Unit Test][unit-test-src]][unit-test-href]

An implementation of the [ECMAScript `throw` expressions](https://github.com/tc39/proposal-throw-expressions) proposal.

> ⚠️ **For demo and toy-level projects only - not for production use!**

## Install

Install the package via npm:

```bash
npm i tc39-throw
```

## Features

This demo project showcases full toolchain integration for the throw operator:

- ✅ **TypeScript** - Full type support with transformations.
- ✅ **Bundler** - Seamless integration with Vite and other bundlers via `unplugin`.
- ✅ **Prettier** - Code formatting support.
- ✅ **ESLint** - Linting with proper syntax recognition.
- ✅ **Development** - Hot reload and dev server support powered by Vite.

## Configuration

### Vite Integration

To integrate with Vite, configure your `vite.config.ts` as follows:

```typescript
// vite.config.ts
import Throw from 'tc39-throw/unplugin'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Throw.vite()],
})
```

### TypeScript Macro

For proper syntax highlighting and IntelliSense support of the throw operator, install the [TS Macro extension](https://marketplace.visualstudio.com/items?itemName=zhiyuanzmj.vscode-ts-macro) in VS Code.

Alternatively, search for "TS Macro" in the VS Code Extensions marketplace.

Then, configure your `ts-macro.config.ts`:

```typescript
// ts-macro.config.ts
import volar from 'tc39-throw/volar'

export default {
  plugins: [volar()],
}
```

### Prettier Configuration

To enable Prettier support for the throw operator, configure your `prettier.config.js` as follows:

```js
// prettier.config.js
import { fileURLToPath } from 'node:url'

export default {
  // ...
  plugins: [fileURLToPath(import.meta.resolve('tc39-throw/prettier'))],
}
```

### ESLint Configuration

To enable ESLint support for the throw operator, configure your `eslint.config.js` as follows:

```js
// eslint.config.js
import { GLOB_JS, GLOB_TS, sxzz } from '@sxzz/eslint-config'
import * as tsParser from 'tc39-throw/eslint-typescript-parser'
import * as jsParser from 'tc39-throw/espree'

export default sxzz().append(
  {
    files: [GLOB_TS],
    languageOptions: { parser: tsParser },
  },
  {
    files: [GLOB_JS],
    languageOptions: { parser: jsParser },
  },
)
```

## Sponsors

<p align="center">
  <a href="https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg">
    <img src='https://cdn.jsdelivr.net/gh/sxzz/sponsors/sponsors.svg'/>
  </a>
</p>

## License

[MIT](./LICENSE) License © 2025-PRESENT [Kevin Deng](https://github.com/sxzz)

[npm-version-src]: https://img.shields.io/npm/v/tc39-throw.svg
[npm-version-href]: https://npmjs.com/package/tc39-throw
[npm-downloads-src]: https://img.shields.io/npm/dm/tc39-throw
[npm-downloads-href]: https://www.npmcharts.com/compare/tc39-throw?interval=30
[unit-test-src]: https://github.com/sxzz/tc39-throw/actions/workflows/unit-test.yml/badge.svg
[unit-test-href]: https://github.com/sxzz/tc39-throw/actions/workflows/unit-test.yml
