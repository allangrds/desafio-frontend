import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { VideoPreview } from './video-preview'

describe('VideoPreview', () => {
  const mockProps = {
    title: 'React 19 New Features',
    thumbnailUrl: 'https://example.com/thumbnail.jpg',
    channelName: 'Tech Channel',
    views: 1500000,
    duration: '12:34',
    href: '/watch?v=abc123',
  }

  it('should render video preview with all content', () => {
    render(<VideoPreview {...mockProps} />)

    expect(
      screen.getByRole('heading', { name: mockProps.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(mockProps.channelName)).toBeInTheDocument()
    expect(screen.getByText(mockProps.duration)).toBeInTheDocument()
    expect(screen.getByText('1.5M views')).toBeInTheDocument()

    const image = screen.getByAltText(`Thumbnail for ${mockProps.title}`)
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute(
      'src',
      expect.stringContaining(encodeURIComponent(mockProps.thumbnailUrl)),
    )

    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(2)
    links.forEach((link) => {
      expect(link).toHaveAttribute('href', mockProps.href)
    })
  })

  it('should format views correctly for less than 1000', () => {
    render(<VideoPreview {...mockProps} views={500} />)
    expect(screen.getByText('500 views')).toBeInTheDocument()
  })

  it('should format views correctly for thousands', () => {
    render(<VideoPreview {...mockProps} views={5000} />)
    expect(screen.getByText('5.0K views')).toBeInTheDocument()
  })

  it('should format views correctly for millions', () => {
    render(<VideoPreview {...mockProps} views={3500000} />)
    expect(screen.getByText('3.5M views')).toBeInTheDocument()
  })
})
