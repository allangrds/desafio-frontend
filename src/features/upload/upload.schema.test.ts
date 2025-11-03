import { uploadVideoSchema } from './upload.schema'

describe('uploadVideoSchema', () => {
  describe('title validation', () => {
    it('should validate title with valid string', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        description: 'A great video',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should reject empty title', () => {
      const result = uploadVideoSchema.safeParse({
        title: '',
        description: 'A great video',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const titleError = result.error.issues.find(
          (err) => err.path[0] === 'title',
        )
        expect(titleError?.message).toBe('Title is required')
      }
    })

    it('should reject title longer than 100 characters', () => {
      const longTitle = 'a'.repeat(101)
      const result = uploadVideoSchema.safeParse({
        title: longTitle,
        description: 'A great video',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const titleError = result.error.issues.find(
          (err) => err.path[0] === 'title',
        )
        expect(titleError?.message).toBe('Title must be 100 characters or less')
      }
    })
  })

  describe('description validation', () => {
    it('should validate optional description', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should reject description longer than 5000 characters', () => {
      const longDescription = 'a'.repeat(5001)
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        description: longDescription,
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const descriptionError = result.error.issues.find(
          (err) => err.path[0] === 'description',
        )
        expect(descriptionError?.message).toBe(
          'Description must be 5000 characters or less',
        )
      }
    })
  })

  describe('privacy validation', () => {
    it('should validate public privacy', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should validate private privacy', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'private',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should validate unlisted privacy', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'unlisted',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should reject invalid privacy value', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'invalid',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(false)
    })
  })

  describe('file validation', () => {
    it('should validate video/mp4 file', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', 1024, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should validate video/webm file', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.webm', 1024, 'video/webm'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should validate video/ogg file', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.ogg', 1024, 'video/ogg'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should validate video/quicktime file', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mov', 1024, 'video/quicktime'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should reject when no file is provided', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const fileError = result.error.issues.find(
          (err) => err.path[0] === 'file',
        )
        expect(fileError?.message).toBe('Video file is required')
      }
    })

    it('should reject file larger than 100MB', () => {
      const fileSize = 101 * 1024 * 1024 // 101MB
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', fileSize, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const fileError = result.error.issues.find(
          (err) => err.path[0] === 'file',
        )
        expect(fileError?.message).toBe('Max file size is 100MB')
      }
    })

    it('should accept file exactly 100MB', () => {
      const fileSize = 100 * 1024 * 1024 // 100MB
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.mp4', fileSize, 'video/mp4'),
        ]),
      })

      expect(result.success).toBe(true)
    })

    it('should reject unsupported file type', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('video.avi', 1024, 'video/avi'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const fileError = result.error.issues.find(
          (err) => err.path[0] === 'file',
        )
        expect(fileError?.message).toBe(
          'Only .mp4, .webm, .ogg and .mov formats are supported',
        )
      }
    })

    it('should reject non-video file types', () => {
      const result = uploadVideoSchema.safeParse({
        title: 'My Video Title',
        privacy: 'public',
        file: createMockFileList([
          createMockFile('document.pdf', 1024, 'application/pdf'),
        ]),
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        const fileError = result.error.issues.find(
          (err) => err.path[0] === 'file',
        )
        expect(fileError?.message).toBe(
          'Only .mp4, .webm, .ogg and .mov formats are supported',
        )
      }
    })
  })
})

// Helper functions to create mock File and FileList objects
function createMockFile(name: string, size: number, type: string): File {
  const file = new File([''], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

function createMockFileList(files: File[]): FileList {
  const fileList = {
    length: files.length,
    item: (index: number) => files[index] || null,
    [Symbol.iterator]: function* () {
      yield* files
    },
  }

  files.forEach((file, index) => {
    // @ts-expect-error - Mocking FileList
    fileList[index] = file
  })

  return fileList as FileList
}
