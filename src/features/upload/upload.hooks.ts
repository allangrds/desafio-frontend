'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { useSearchHistoryStore } from '@/stores/search-history'
import type { UploadedVideo, UploadProgress } from '@/types/youtube'
import { type UploadVideoFormData, uploadVideoSchema } from './upload.schema'

export const useUploadLogic = () => {
  const router = useRouter()
  const { searches, addSearch } = useSearchHistoryStore()
  const [progress, setProgress] = React.useState<UploadProgress>({
    percentage: 0,
    status: 'idle',
  })
  const [uploadedVideo, setUploadedVideo] =
    React.useState<UploadedVideo | null>(null)

  const form = useForm<UploadVideoFormData>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: '',
      description: '',
      privacy: 'public',
    },
  })

  const onSubmit = async (data: UploadVideoFormData) => {
    try {
      setProgress({ percentage: 0, status: 'uploading' })

      const formData = new FormData()
      formData.append('title', data.title)
      formData.append('description', data.description || '')
      formData.append('privacy', data.privacy)
      formData.append('file', data.file[0])

      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev.percentage >= 90) {
            clearInterval(progressInterval)
            return { ...prev, percentage: 90, status: 'processing' }
          }
          return { ...prev, percentage: prev.percentage + 10 }
        })
      }, 500)

      const response = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      setProgress({ percentage: 100, status: 'complete' })
      setUploadedVideo(result)
      form.reset()
    } catch (error) {
      console.error('Upload error:', error)
      setProgress({
        percentage: 0,
        status: 'error',
        message: 'Failed to upload video. Please try again.',
      })
    }
  }

  const onSearch = (query: string) =>
    router.push(`/results?search=${encodeURIComponent(query)}`)
  const onAddSearch = (query: string) => addSearch(query)

  return {
    form,
    progress,
    uploadedVideo,
    onSubmit,
    onSearch,
    onAddSearch,
    initialQuery: '',
    recentSearches: searches,
  }
}
