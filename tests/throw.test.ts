import { expect, test } from 'vitest'

test('throw', () => {
  let x: boolean | undefined
  let err: any
  try {
    // eslint-disable-next-line no-constant-condition
    x = false ? true : throw new Error('test error')
  } catch (error) {
    err = error
  }

  expect(x).toBeUndefined()
  expect(err).toBeInstanceOf(Error)
})
