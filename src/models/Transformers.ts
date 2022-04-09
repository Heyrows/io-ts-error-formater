import type * as t from 'io-ts'

export interface Transformers<T> {
  transformGlobalObjectError: (entry: t.ContextEntry) => T
  transformSingleValueError: (entry: t.ContextEntry) => T
  transformUnionValueErrors: (entries: t.ContextEntry[]) => T
}
