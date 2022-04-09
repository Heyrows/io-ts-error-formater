import * as t from 'io-ts'

export type ErrorSimplified = { keys: string[]; lastEntry: t.ContextEntry }

export type ErrorsGrouped = { [key: string]: t.ContextEntry[] }

export interface DefaultFormattedError {
  attribute: string
  actualValue: unknown
  expectedValue: string
}
