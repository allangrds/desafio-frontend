import { zodResolver } from '@hookform/resolvers/zod'
import type { Meta, StoryObj } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { expect, fn, userEvent, within } from 'storybook/test'
import { type UploadVideoFormData, uploadVideoSchema } from './upload.schema'
import { UploadView } from './upload.view'

const baseHeader = {
  onSearch: fn(),
  onAddSearch: fn(),
  initialQuery: '',
  recentSearches: [],
  SignInRegisterButtons: null,
}

const UploadViewWithForm = (
  props: Omit<React.ComponentProps<typeof UploadView>, 'form'>,
) => {
  const form = useForm<UploadVideoFormData>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: { title: '', description: '', privacy: 'public' },
  })
  return <UploadView {...props} form={form} />
}

const meta = {
  title: 'Features/Upload',
  component: UploadViewWithForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof UploadViewWithForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...baseHeader,
    progress: { percentage: 0, status: 'idle' },
    uploadedVideo: null,
    onSubmit: fn(),
    SignInRegisterButtons: null,
  },
}

export const Uploading: Story = {
  args: {
    ...baseHeader,
    progress: { percentage: 45, status: 'uploading' },
    uploadedVideo: null,
    onSubmit: fn(),
    SignInRegisterButtons: null,
  },
}

export const UploadSuccess: Story = {
  args: {
    ...baseHeader,
    progress: { percentage: 100, status: 'complete' },
    uploadedVideo: {
      id: 'abc123',
      title: 'My Awesome Video',
      description: 'A great video I made',
      privacy: 'public',
      url: 'https://www.youtube.com/watch?v=abc123',
    },
    onSubmit: fn(),
    SignInRegisterButtons: null,
  },
}

export const ValidationError: Story = {
  args: {
    ...baseHeader,
    progress: { percentage: 0, status: 'idle' },
    uploadedVideo: null,
    onSubmit: fn(),
    SignInRegisterButtons: null,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const submitButton = canvas.getByRole('button', { name: /upload/i })
    await userEvent.click(submitButton)
    const error = await canvas.findByText(/title is required/i)
    await expect(error).toBeInTheDocument()
  },
}

export const UploadError: Story = {
  args: {
    ...baseHeader,
    progress: {
      percentage: 0,
      status: 'error',
      message: 'Failed to upload video. Please try again.',
    },
    uploadedVideo: null,
    onSubmit: fn(),
    SignInRegisterButtons: null,
  },
}
