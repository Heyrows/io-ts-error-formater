export function isKeyIndex(key: string): boolean {
  return !isNaN(parseInt(key, 10))
}

const keySplitter = '.'
export function joinKeys(keys: string[]) {
  return keys.join(keySplitter)
}

export function splitKeys(key: string) {
  return key.split(keySplitter)
}
