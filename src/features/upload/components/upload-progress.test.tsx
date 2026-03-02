import { render, screen } from '@testing-library/react'
import type { UploadProgress as UploadProgressType } from '@/types/youtube'
import { UploadProgress } from './upload-progress'

describe('UploadProgress', () => {
  it('should not render when status is idle', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'idle',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    expect(container.firstChild).toBeNull()
  })

  it('should render uploading status with percentage', () => {
    const progress: UploadProgressType = {
      percentage: 45,
      status: 'uploading',
    }

    render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Uploading...')).toBeDefined()
    expect(screen.getByText('45%')).toBeDefined()
  })

  it('should render processing status with percentage', () => {
    const progress: UploadProgressType = {
      percentage: 90,
      status: 'processing',
    }

    render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Processing...')).toBeDefined()
    expect(screen.getByText('90%')).toBeDefined()
  })

  it('should render complete status with success message', () => {
    const progress: UploadProgressType = {
      percentage: 100,
      status: 'complete',
    }

    render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Complete!')).toBeDefined()
    expect(screen.getByText('100%')).toBeDefined()
    expect(
      screen.getByText('Your video has been uploaded successfully!'),
    ).toBeDefined()
  })

  it('should render error status with error message', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'error',
      message: 'Failed to upload video. Please try again.',
    }

    render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Error')).toBeDefined()
    expect(screen.getByText('0%')).toBeDefined()
    expect(
      screen.getByText('Failed to upload video. Please try again.'),
    ).toBeDefined()
  })

  it('should not render progress bar on error status', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'error',
      message: 'Upload failed',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    // Progress component should not be rendered
    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).toBeNull()
  })

  it('should render progress bar for uploading status', () => {
    const progress: UploadProgressType = {
      percentage: 50,
      status: 'uploading',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).not.toBeNull()
  })

  it('should render progress bar for processing status', () => {
    const progress: UploadProgressType = {
      percentage: 90,
      status: 'processing',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).not.toBeNull()
  })

  it('should render progress bar for complete status', () => {
    const progress: UploadProgressType = {
      percentage: 100,
      status: 'complete',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    const progressBar = container.querySelector('[role="progressbar"]')
    expect(progressBar).not.toBeNull()
  })

  it('should render error message when status is error and message is provided', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'error',
      message: 'Custom error message',
    }

    render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Custom error message')).toBeDefined()
  })

  it('should handle error status without message', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'error',
    }

    const { container } = render(<UploadProgress progress={progress} />)

    expect(screen.getByText('Error')).toBeDefined()
    // Should not crash when message is undefined
    expect(container).toBeDefined()
  })

  it('should apply correct color class for uploading status', () => {
    const progress: UploadProgressType = {
      percentage: 30,
      status: 'uploading',
    }

    render(<UploadProgress progress={progress} />)

    const statusText = screen.getByText('Uploading...')
    expect(statusText.className).toContain('text-blue-600')
  })

  it('should apply correct color class for processing status', () => {
    const progress: UploadProgressType = {
      percentage: 90,
      status: 'processing',
    }

    render(<UploadProgress progress={progress} />)

    const statusText = screen.getByText('Processing...')
    expect(statusText.className).toContain('text-yellow-600')
  })

  it('should apply correct color class for complete status', () => {
    const progress: UploadProgressType = {
      percentage: 100,
      status: 'complete',
    }

    render(<UploadProgress progress={progress} />)

    const statusText = screen.getByText('Complete!')
    expect(statusText.className).toContain('text-green-600')
  })

  it('should apply correct color class for error status', () => {
    const progress: UploadProgressType = {
      percentage: 0,
      status: 'error',
      message: 'Error occurred',
    }

    render(<UploadProgress progress={progress} />)

    const statusText = screen.getByText('Error')
    expect(statusText.className).toContain('text-red-600')
  })

  it('should render percentage at different values', () => {
    const testCases = [0, 25, 50, 75, 100]

    for (const percentage of testCases) {
      const progress: UploadProgressType = {
        percentage,
        status: 'uploading',
      }

      const { rerender } = render(<UploadProgress progress={progress} />)

      expect(screen.getByText(`${percentage}%`)).toBeDefined()

      rerender(<UploadProgress progress={{ ...progress, percentage: 0 }} />)
    }
  })

  it('should show success message only on complete status', () => {
    const progress: UploadProgressType = {
      percentage: 100,
      status: 'uploading',
    }

    const { rerender } = render(<UploadProgress progress={progress} />)

    expect(
      screen.queryByText('Your video has been uploaded successfully!'),
    ).toBeNull()

    rerender(<UploadProgress progress={{ ...progress, status: 'complete' }} />)

    expect(
      screen.getByText('Your video has been uploaded successfully!'),
    ).toBeDefined()
  })
})
