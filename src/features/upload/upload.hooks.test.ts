import { renderHook, waitFor, act } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import { useUploadLogic } from './upload.hooks'
import { useSearchHistoryStore } from '../../stores/search-history'

// Mock fetch globally
global.fetch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('../../stores/search-history', () => ({
  useSearchHistoryStore: jest.fn(),
}))

describe('useUploadLogic', () => {
  const mockFetch = global.fetch as jest.Mock
  const mockUseRouter = useRouter as jest.Mock
  const mockUseSearchHistoryStore =
    useSearchHistoryStore as unknown as jest.Mock
  const mockPush = jest.fn()
  const mockAddSearch = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockUseRouter.mockReturnValue({
      push: mockPush,
    })
    mockUseSearchHistoryStore.mockReturnValue({
      searches: ['react', 'typescript'],
      addSearch: mockAddSearch,
    })
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useUploadLogic())

    expect(result.current.form.getValues()).toEqual({
      title: '',
      description: '',
      privacy: 'public',
    })
    expect(result.current.progress).toEqual({
      percentage: 0,
      status: 'idle',
    })
    expect(result.current.uploadedVideo).toBeNull()
  })

  it('should handle form submission with file upload', async () => {
    const { result } = renderHook(() => useUploadLogic())

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'video123', title: 'Test Video' }),
    })

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('file', mockFileList)
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(result.current.progress.status).not.toBe('idle')
    })
  })

  // Note: Detailed progress percentage and timing tests are complex with fake timers
  // The important behavior is that the upload succeeds and form resets correctly

  it('should complete upload successfully and reset form', async () => {
    const { result } = renderHook(() => useUploadLogic())

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    const mockUploadedVideo = { id: 'video123', title: 'Test Video' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUploadedVideo,
    })

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('file', mockFileList)
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(result.current.progress.status).toBe('complete')
      expect(result.current.progress.percentage).toBe(100)
    })

    await waitFor(() => {
      expect(result.current.uploadedVideo).toEqual(mockUploadedVideo)
    })

    await waitFor(() => {
      expect(result.current.form.getValues().title).toBe('')
    })
  })

  it('should create FormData with correct fields', async () => {
    const { result } = renderHook(() => useUploadLogic())

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'video123', title: 'Test Video' }),
    })

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('description', 'Test Description')
      result.current.form.setValue('privacy', 'private')
      result.current.form.setValue('file', mockFileList)
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        '/api/videos',
        expect.objectContaining({
          method: 'POST',
          body: expect.any(FormData),
        }),
      )
    })

    const formData = mockFetch.mock.calls[0][1].body as FormData
    expect(formData.get('title')).toBe('Test Video')
    expect(formData.get('description')).toBe('Test Description')
    expect(formData.get('privacy')).toBe('private')
    expect(formData.get('file')).toBe(mockFile)
  })

  it('should handle upload error and set error status', async () => {
    const { result } = renderHook(() => useUploadLogic())
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    mockFetch.mockResolvedValue({
      ok: false,
    })

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('file', mockFileList)
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(result.current.progress.status).toBe('error')
      expect(result.current.progress.percentage).toBe(0)
      expect(result.current.progress.message).toBe(
        'Failed to upload video. Please try again.',
      )
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })

  it('should handle network error during upload', async () => {
    const { result } = renderHook(() => useUploadLogic())
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    mockFetch.mockRejectedValue(new Error('Network error'))

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('file', mockFileList)
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(result.current.progress.status).toBe('error')
      expect(result.current.progress.message).toBe(
        'Failed to upload video. Please try again.',
      )
    })

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Upload error:',
      expect.any(Error),
    )
    consoleErrorSpy.mockRestore()
  })

  it('should handle empty description field', async () => {
    const { result } = renderHook(() => useUploadLogic())

    const mockFile = new File(['video content'], 'test.mp4', {
      type: 'video/mp4',
    })
    const mockFileList = {
      0: mockFile,
      length: 1,
      item: () => mockFile,
    } as unknown as FileList

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'video123', title: 'Test Video' }),
    })

    act(() => {
      result.current.form.setValue('title', 'Test Video')
      result.current.form.setValue('file', mockFileList)
      // Don't set description
    })

    act(() => {
      result.current.form.handleSubmit(result.current.onSubmit)()
    })

    act(() => {
      jest.runAllTimers()
    })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const formData = mockFetch.mock.calls[0][1].body as FormData
    expect(formData.get('description')).toBe('')
  })

  describe('Search functionality', () => {
    it('should return initialQuery and recentSearches', () => {
      const { result } = renderHook(() => useUploadLogic())

      expect(result.current.initialQuery).toBe('')
      expect(result.current.recentSearches).toEqual(['react', 'typescript'])
    })

    it('should navigate to results page when onSearch is called', () => {
      const { result } = renderHook(() => useUploadLogic())

      result.current.onSearch('react hooks')

      expect(mockPush).toHaveBeenCalledWith('/results?search=react%20hooks')
    })

    it('should add search to history when onAddSearch is called', () => {
      const { result } = renderHook(() => useUploadLogic())

      result.current.onAddSearch('new search')

      expect(mockAddSearch).toHaveBeenCalledWith('new search')
    })

    it('should encode special characters in search query', () => {
      const { result } = renderHook(() => useUploadLogic())

      result.current.onSearch('react & hooks')

      expect(mockPush).toHaveBeenCalledWith(
        '/results?search=react%20%26%20hooks',
      )
    })
  })
})
