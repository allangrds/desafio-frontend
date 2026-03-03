declare module 'lru-cache' {
  interface Options {
    max?: number
    maxAge?: number
  }

  class LRUCache<K, V> {
    constructor(options?: Options)
    get(key: K): V | undefined
    set(key: K, value: V): void
    has(key: K): boolean
    del(key: K): void
    reset(): void
  }

  export = LRUCache
}
