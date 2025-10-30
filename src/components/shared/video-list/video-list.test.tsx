import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { VideoList } from './video-list'

const mockVideos = [
  {
    id: '1',
    title: 'Test Video 1',
    thumbnailUrl: '/test-thumbnail-1.jpg',
    channelName: 'Test Channel 1',
    views: 1500000,
    duration: '10:30',
    href: '/video/1',
  },
  {
    id: '2',
    title: 'Test Video 2',
    thumbnailUrl: '/test-thumbnail-2.jpg',
    channelName: 'Test Channel 2',
    views: 5000,
    duration: '5:45',
    href: '/video/2',
  },
  {
    id: '3',
    title: 'Test Video 3',
    thumbnailUrl: '/test-thumbnail-3.jpg',
    channelName: 'Test Channel 3',
    views: 500,
    duration: '15:20',
    href: '/video/3',
  },
]

describe('VideoList', () => {
  it('should render all videos from the list', () => {
    render(<VideoList videos={mockVideos} />)

    expect(screen.getByText('Test Video 1')).toBeInTheDocument()
    expect(screen.getByText('Test Video 2')).toBeInTheDocument()
    expect(screen.getByText('Test Video 3')).toBeInTheDocument()

    expect(screen.getByText('Test Channel 1')).toBeInTheDocument()
    expect(screen.getByText('Test Channel 2')).toBeInTheDocument()
    expect(screen.getByText('Test Channel 3')).toBeInTheDocument()

    expect(screen.getByText('1.5M views')).toBeInTheDocument()
    expect(screen.getByText('5.0K views')).toBeInTheDocument()
    expect(screen.getByText('500 views')).toBeInTheDocument()

    expect(screen.getByText('10:30')).toBeInTheDocument()
    expect(screen.getByText('5:45')).toBeInTheDocument()
    expect(screen.getByText('15:20')).toBeInTheDocument()

    const articles = screen.queryAllByRole('article')
    expect(articles).toHaveLength(3)
  })

  it('should render images with correct alt text', () => {
    render(<VideoList videos={mockVideos} />)

    expect(
      screen.getByAltText('Thumbnail for Test Video 1'),
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Thumbnail for Test Video 2'),
    ).toBeInTheDocument()
    expect(
      screen.getByAltText('Thumbnail for Test Video 3'),
    ).toBeInTheDocument()
  })

  it('should render links with correct href attributes', () => {
    render(<VideoList videos={mockVideos} />)

    const links = screen.getAllByRole('link')
    const videoLinks = links.filter((link) =>
      link.getAttribute('href')?.startsWith('/video'),
    )

    expect(videoLinks).toHaveLength(6)
  })

  it('should render empty list when no videos provided', () => {
    const { container } = render(<VideoList videos={[]} />)
    const articles = container.querySelectorAll('article')

    expect(articles).toHaveLength(0)
  })
})
