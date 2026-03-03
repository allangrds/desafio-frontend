import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { UploadContainer } from './upload.container'

jest.mock('./upload.hooks', () => ({
  useUploadLogic: jest.fn(() => ({
    form: {},
    progress: { status: 'idle', percentage: 0 },
    uploadedVideo: null,
    onSubmit: jest.fn(),
    onSearch: jest.fn(),
    onAddSearch: jest.fn(),
    initialQuery: '',
    recentSearches: [],
  })),
}))

jest.mock('./upload.view', () => ({
  UploadView: jest.fn(({ SignInRegisterButtons }) => (
    <div data-testid="upload-view">{SignInRegisterButtons}</div>
  )),
}))

describe('UploadContainer', () => {
  it('renders UploadView', () => {
    render(<UploadContainer userMenuSlot={null} />)

    expect(screen.getByTestId('upload-view')).toBeInTheDocument()
  })

  it('passes userMenuSlot to UploadView', () => {
    const userMenuSlot = <div data-testid="user-menu">UserMenu</div>

    render(<UploadContainer userMenuSlot={userMenuSlot} />)

    expect(screen.getByTestId('user-menu')).toBeInTheDocument()
    expect(screen.getByText('UserMenu')).toBeInTheDocument()
  })
})
