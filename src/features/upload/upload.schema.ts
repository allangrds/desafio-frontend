import { z } from 'zod'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
const ACCEPTED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
]

export const uploadVideoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  description: z
    .string()
    .max(5000, 'Description must be 5000 characters or less')
    .optional(),
  privacy: z.enum(['public', 'private', 'unlisted']),
  file: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Video file is required')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      'Max file size is 100MB',
    )
    .refine(
      (files) => ACCEPTED_VIDEO_TYPES.includes(files?.[0]?.type),
      'Only .mp4, .webm, .ogg and .mov formats are supported',
    ),
})

export type UploadVideoFormData = z.infer<typeof uploadVideoSchema>
