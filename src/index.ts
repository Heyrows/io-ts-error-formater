import * as t from 'io-ts'
import type {
  Transformers,
  ErrorSimplified,
  ErrorsGrouped,
  DefaultFormattedError,
} from './models'
import { isKeyIndex, joinKeys } from './utils/keys'
import { defaultTransformers } from './utils/defaultTransformer'

export default {
  formatIoTsErrors,
  formatIoTsErrorsD,
}

export function formatIoTsErrors<T>(
  errors: t.Errors,
  transformers: Transformers<T>
): T[] {
  // special case: the data decoded was not an object
  const globalObjectEntry = errors[0].context[0]
  if (typeof globalObjectEntry.actual != 'object') {
    return [transformers.transformGlobalObjectError(globalObjectEntry)]
  }

  const errorsSimplified: Array<ErrorSimplified> = errors.reduce(
    (acc: ErrorSimplified[], error) => {
      // remove first entry about global object
      const [_, ...entriesToFilter] = error.context

      // get last entry for expected and actual value
      const lastEntry: t.ContextEntry = error.context[error.context.length - 1]

      // remove array entries
      const entries: t.ContextEntry[] = entriesToFilter.filter(
        (entry) => !isKeyIndex(entry.key)
      )

      return [
        ...acc,
        {
          keys: entries.map((entry) => entry.key),
          lastEntry: lastEntry,
        },
      ]
    },
    []
  )

  // group the union types errors together
  const errorsGrouped = errorsSimplified.reduce((acc: ErrorsGrouped, error) => {
    const key = joinKeys(error.keys)
    const existingError: t.ContextEntry[] | undefined = acc[key]

    return {
      ...acc,
      [key]: existingError
        ? [...existingError, error.lastEntry]
        : [error.lastEntry],
    }
  }, {})

  // transform the io-ts entries into expected type
  return Object.entries(errorsGrouped).map((element) => {
    const key = element[0]
    const errors = element[1]

    if (errors.length === 1)
      return transformers.transformSingleValueError(errors[0])
    else return transformers.transformUnionValueErrors(errors)
  })
}

export function formatIoTsErrorsD(errors: t.Errors): DefaultFormattedError[] {
  return formatIoTsErrors(errors, defaultTransformers)
}
