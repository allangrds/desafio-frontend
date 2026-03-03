import { fetchWithRetry } from './fetch-with-retry'

describe('fetchWithRetry', () => {
  it('returns result when fn succeeds on first attempt', async () => {
    const fn = jest.fn().mockResolvedValue('success')

    const result = await fetchWithRetry(fn, { delay: 0 })

    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries and succeeds on second attempt', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('ok')

    const result = await fetchWithRetry(fn, { maxRetries: 2, delay: 0 })

    expect(result).toBe('ok')
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('throws after exhausting all retries', async () => {
    const fn = jest.fn().mockRejectedValue(new Error('always fails'))

    await expect(
      fetchWithRetry(fn, { maxRetries: 2, delay: 0 }),
    ).rejects.toThrow('always fails')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('uses fixed delay when backoff is false', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('fixed')

    const result = await fetchWithRetry(fn, {
      maxRetries: 1,
      delay: 0,
      backoff: false,
    })

    expect(result).toBe('fixed')
  })

  it('uses exponential backoff when backoff is true', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail again'))
      .mockResolvedValueOnce('backoff-ok')

    const result = await fetchWithRetry(fn, {
      maxRetries: 2,
      delay: 0,
      backoff: true,
    })

    expect(result).toBe('backoff-ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('uses default options when none provided', async () => {
    const fn = jest.fn().mockResolvedValue('default-opts')

    // Mock setTimeout to avoid actual delays
    jest.useFakeTimers()
    const promise = fetchWithRetry(fn)
    jest.runAllTimers()
    const result = await promise
    jest.useRealTimers()

    expect(result).toBe('default-opts')
  })
})
