import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UploadForm } from './upload-form'
import { uploadVideoSchema, UploadVideoFormData } from '../upload.schema'

// Wrapper component to provide form context
const UploadFormWrapper = ({
  onSubmit,
  isUploading = false,
}: {
  onSubmit: (data: UploadVideoFormData) => void
  isUploading?: boolean
}) => {
  const form = useForm<UploadVideoFormData>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: '',
      description: '',
      privacy: 'public',
    },
  })

  return (
    <UploadForm form={form} onSubmit={onSubmit} isUploading={isUploading} />
  )
}

describe('UploadForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render all form fields', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/title/i)).toBeDefined()
    expect(screen.getByLabelText(/description/i)).toBeDefined()
    expect(screen.getByLabelText(/privacy/i)).toBeDefined()
    expect(screen.getByLabelText(/video file/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /upload video/i })).toBeDefined()
  })

  it('should render card with correct title', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    expect(screen.getByText('Upload Video to YouTube')).toBeDefined()
  })

  it('should render field descriptions', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    expect(
      screen.getByText('The title of your video (max 100 characters)'),
    ).toBeDefined()
    expect(
      screen.getByText('Describe your video (max 5000 characters)'),
    ).toBeDefined()
    expect(screen.getByText('Who can see your video on YouTube')).toBeDefined()
    expect(
      screen.getByText('Supported formats: MP4, WebM, OGG, MOV (max 100MB)'),
    ).toBeDefined()
  })

  it('should show required field markers', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    expect(screen.getByLabelText(/title \*/i)).toBeDefined()
    expect(screen.getByLabelText(/privacy \*/i)).toBeDefined()
    expect(screen.getByLabelText(/video file \*/i)).toBeDefined()
  })

  it('should disable all inputs when isUploading is true', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} isUploading={true} />)

    expect(screen.getByLabelText(/title/i)).toHaveProperty('disabled', true)
    expect(screen.getByLabelText(/description/i)).toHaveProperty(
      'disabled',
      true,
    )
    expect(screen.getByLabelText(/video file/i)).toHaveProperty(
      'disabled',
      true,
    )
    expect(
      screen.getByRole('button', { name: /uploading.../i }),
    ).toHaveProperty('disabled', true)
  })

  it('should change submit button text when uploading', () => {
    const { rerender } = render(
      <UploadFormWrapper onSubmit={mockOnSubmit} isUploading={false} />,
    )

    expect(screen.getByRole('button', { name: /upload video/i })).toBeDefined()

    rerender(<UploadFormWrapper onSubmit={mockOnSubmit} isUploading={true} />)

    expect(screen.getByRole('button', { name: /uploading.../i })).toBeDefined()
  })

  it('should accept file input with correct file types', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const fileInput = screen.getByLabelText(/video file/i) as HTMLInputElement

    expect(fileInput.accept).toBe(
      'video/mp4,video/webm,video/ogg,video/quicktime',
    )
  })

  it('should render privacy select with all options', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const privacySelect = screen.getByLabelText(/privacy/i)
    fireEvent.click(privacySelect)

    expect(screen.getByRole('option', { name: /public/i })).toBeDefined()
    expect(screen.getByRole('option', { name: /private/i })).toBeDefined()
    expect(screen.getByRole('option', { name: /unlisted/i })).toBeDefined()
  })

  // Note: Testing privacy select state behavior is complex with third-party UI libraries
  // The important thing is that the select renders and accepts user input
  // Detailed state management testing is handled by the Select component library

  it('should show validation error when title is empty', async () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /upload video/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeDefined()
    })
  })

  it('should show validation error when title exceeds 100 characters', async () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByLabelText(/title/i)
    const longTitle = 'a'.repeat(101)

    fireEvent.change(titleInput, { target: { value: longTitle } })

    const submitButton = screen.getByRole('button', { name: /upload video/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Title must be 100 characters or less'),
      ).toBeDefined()
    })
  })

  it('should show validation error when description exceeds 5000 characters', async () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const descriptionInput = screen.getByLabelText(/description/i)
    const longDescription = 'a'.repeat(5001)

    fireEvent.change(descriptionInput, { target: { value: longDescription } })

    const submitButton = screen.getByRole('button', { name: /upload video/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(
        screen.getByText('Description must be 5000 characters or less'),
      ).toBeDefined()
    })
  })

  it('should show validation error when file is not provided', async () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByLabelText(/title/i)
    fireEvent.change(titleInput, { target: { value: 'Test Video' } })

    const submitButton = screen.getByRole('button', { name: /upload video/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Video file is required')).toBeDefined()
    })
  })

  it('should render textarea with 5 rows', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const descriptionTextarea = screen.getByLabelText(
      /description/i,
    ) as HTMLTextAreaElement

    expect(descriptionTextarea.rows).toBe(5)
  })

  it('should have correct placeholders', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    expect(screen.getByPlaceholderText('Enter video title')).toBeDefined()
    expect(
      screen.getByPlaceholderText('Enter video description (optional)'),
    ).toBeDefined()
  })

  it('should allow user to type in title field', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement

    fireEvent.change(titleInput, { target: { value: 'My Test Video' } })

    expect(titleInput.value).toBe('My Test Video')
  })

  it('should allow user to type in description field', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const descriptionInput = screen.getByLabelText(
      /description/i,
    ) as HTMLTextAreaElement

    fireEvent.change(descriptionInput, {
      target: { value: 'This is my test video description' },
    })

    expect(descriptionInput.value).toBe('This is my test video description')
  })

  it('should submit button have full width class', () => {
    render(<UploadFormWrapper onSubmit={mockOnSubmit} />)

    const submitButton = screen.getByRole('button', { name: /upload video/i })

    expect(submitButton.className).toContain('w-full')
  })
})
