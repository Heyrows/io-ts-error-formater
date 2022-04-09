import * as t from 'io-ts'
import { either } from 'fp-ts'
import { formatIoTsErrorsD } from '../src'

describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('should transform error from a complex codec', () => {
    const ExpectedType = t.exact(
      t.type({
        aString: t.string,
        aNumber: t.number,
        aUnion: t.union([
          t.literal('toto'),
          t.literal('tutu'),
          t.literal('titi'),
        ]),
        aObject: t.type({
          value1: t.string,
          value2: t.intersection([
            t.type({
              required: t.string,
            }),
            t.partial({
              partial: t.string,
            }),
          ]),
        }),
      })
    )
    type ExpectedType = t.TypeOf<typeof ExpectedType>

    const data = {
      aString: 'ok',
      aNumber: null,
      aUnion: '2',
      aObject: {
        value1: 2,
        value2: {
          required: 3,
          partial: 4,
        },
      },
    }

    either.fold<t.Errors, ExpectedType, void>(
      (errors: t.Errors) => {
        const result = formatIoTsErrorsD(errors)

        console.log(result)
      },
      (result: ExpectedType) => result
    )(ExpectedType.decode(data))
  })
})
