import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import React from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { UploadVideoFormData } from './upload.schema'
import type { UploadViewProps } from './upload.view'

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: {
    href: string
    children: React.ReactNode
    [key: string]: unknown
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

jest.mock('@/components/shared/header', () => ({
  Header: jest.fn(({ children }: { children?: React.ReactNode }) => (
    <div data-testid="header">{children}</div>
  )),
}))

jest.mock('@/components/ui/button', () => ({
  Button: jest.fn(
    ({
      children,
      asChild,
      ...props
    }: {
      children: React.ReactNode
      asChild?: boolean
      [key: string]: unknown
    }) => {
      if (asChild && React.isValidElement(children)) {
        return children
      }
      return <button {...props}>{children}</button>
    },
  ),
}))

jest.mock('@/components/ui/card', () => ({
  Card: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="card">{children}</div>
  )),
  CardContent: jest.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  )),
}))

jest.mock('./components/upload-form', () => ({
  UploadForm: jest.fn(() => <div data-testid="upload-form" />),
}))

jest.mock('./components/upload-progress', () => ({
  UploadProgress: jest.fn(() => <div data-testid="upload-progress" />),
}))

const mockForm = {
  handleSubmit: jest.fn(),
  formState: { errors: {}, isSubmitting: false },
  register: jest.fn(),
  control: {},
} as unknown as UseFormReturn<UploadVideoFormData>

const baseProps: UploadViewProps = {
  form: mockForm,
  progress: { status: 'idle', percentage: 0 },
  uploadedVideo: null,
  onSubmit: jest.fn(),
  onSearch: jest.fn(),
  onAddSearch: jest.fn(),
  initialQuery: '',
  recentSearches: [],
  SignInRegisterButtons: null,
}

describe('UploadView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders "Upload Video" heading', async () => {
    const { UploadView } = await import('./upload.view')

    render(<UploadView {...baseProps} />)

    expect(screen.getByText('Upload Video')).toBeInTheDocument()
  })

  it('does not show UploadProgress when status is idle', async () => {
    const { UploadView } = await import('./upload.view')

    render(
      <UploadView
        {...baseProps}
        progress={{ status: 'idle', percentage: 0 }}
      />,
    )

    expect(screen.queryByTestId('upload-progress')).not.toBeInTheDocument()
  })

  it('shows UploadProgress when status is uploading', async () => {
    const { UploadView } = await import('./upload.view')

    render(
      <UploadView
        {...baseProps}
        progress={{ status: 'uploading', percentage: 50 }}
      />,
    )

    expect(screen.getByTestId('upload-progress')).toBeInTheDocument()
  })

  it('shows uploaded video card when status is complete and uploadedVideo is set', async () => {
    const { UploadView } = await import('./upload.view')
    const uploadedVideo = {
      id: '1',
      title: 'Test Video',
      description: 'Desc',
      privacy: 'public' as const,
      url: 'http://youtube.com/watch?v=1',
    }

    render(
      <UploadView
        {...baseProps}
        progress={{ status: 'complete', percentage: 100 }}
        uploadedVideo={uploadedVideo}
      />,
    )

    expect(screen.getByText('Test Video')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
    expect(screen.getByText('View on YouTube')).toBeInTheDocument()
    expect(screen.getByText('Go to Home')).toBeInTheDocument()
  })

  it('does not show uploaded video card when uploadedVideo is null', async () => {
    const { UploadView } = await import('./upload.view')

    render(
      <UploadView
        {...baseProps}
        progress={{ status: 'complete', percentage: 100 }}
        uploadedVideo={null}
      />,
    )

    expect(screen.queryByText('View on YouTube')).not.toBeInTheDocument()
  })
})
