import * as t from 'io-ts'
import type { Transformers, DefaultFormattedError } from '../models'

export const defaultTransformers: Transformers<DefaultFormattedError> = {
  transformGlobalObjectError: (entry: t.ContextEntry) => ({
    attribute: entry.key,
    actualValue: entry.actual,
    expectedValue: entry.type.name,
  }),
  transformSingleValueError: (entry: t.ContextEntry) => ({
    attribute: entry.key,
    actualValue: entry.actual,
    expectedValue: entry.type.name,
  }),
  transformUnionValueErrors: (entries: t.ContextEntry[]) => ({
    attribute: entries[0].key,
    actualValue: entries[0].actual,
    expectedValue: entries.map((entry) => entry.type.name).join(' | '),
  }),
}
