'use client'

import type { UseFormReturn } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { UploadVideoFormData } from '../upload.schema'

type UploadFormProps = {
  form: UseFormReturn<UploadVideoFormData>
  onSubmit: (data: UploadVideoFormData) => void
  isUploading: boolean
}

export const UploadForm = ({
  form,
  onSubmit,
  isUploading,
}: UploadFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = form

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Video to YouTube</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <Field>
            <FieldLabel htmlFor="title">Title *</FieldLabel>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter video title"
              disabled={isUploading}
            />
            <FieldDescription>
              The title of your video (max 100 characters)
            </FieldDescription>
            {errors.title && <FieldError>{errors.title.message}</FieldError>}
          </Field>

          {/* Description Field */}
          <Field>
            <FieldLabel htmlFor="description">Description</FieldLabel>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter video description (optional)"
              disabled={isUploading}
              rows={5}
            />
            <FieldDescription>
              Describe your video (max 5000 characters)
            </FieldDescription>
            {errors.description && (
              <FieldError>{errors.description.message}</FieldError>
            )}
          </Field>

          {/* Privacy Field */}
          <Field>
            <FieldLabel htmlFor="privacy">Privacy *</FieldLabel>
            <Select
              disabled={isUploading}
              defaultValue="public"
              onValueChange={(value) =>
                setValue('privacy', value as 'public' | 'private' | 'unlisted')
              }
            >
              <SelectTrigger id="privacy">
                <SelectValue placeholder="Select privacy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="unlisted">Unlisted</SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Who can see your video on YouTube
            </FieldDescription>
            {errors.privacy && (
              <FieldError>{errors.privacy.message}</FieldError>
            )}
          </Field>

          {/* File Field */}
          <Field>
            <FieldLabel htmlFor="file">Video File *</FieldLabel>
            <Input
              id="file"
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              {...register('file')}
              disabled={isUploading}
            />
            <FieldDescription>
              Supported formats: MP4, WebM, OGG, MOV (max 100MB)
            </FieldDescription>
            {errors.file && <FieldError>{errors.file.message}</FieldError>}
          </Field>

          {/* Submit Button */}
          <Button type="submit" disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Upload Video'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
