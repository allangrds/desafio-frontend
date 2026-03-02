'use client'

import Link from 'next/link'
import type { UseFormReturn } from 'react-hook-form'
import { Header } from '@/components/shared/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type {
  UploadedVideo,
  UploadProgress as UploadProgressType,
} from '@/types/youtube'
import { UploadForm } from './components/upload-form'
import { UploadProgress } from './components/upload-progress'
import type { UploadVideoFormData } from './upload.schema'

export type UploadViewProps = {
  form: UseFormReturn<UploadVideoFormData>
  progress: UploadProgressType
  uploadedVideo: UploadedVideo | null
  onSubmit: (data: UploadVideoFormData) => void
  onSearch: (query: string) => void
  onAddSearch: (query: string) => void
  initialQuery: string
  recentSearches: string[]
  SignInRegisterButtons: React.ReactNode
}

export const UploadView = ({
  form,
  progress,
  uploadedVideo,
  onSubmit,
  onSearch,
  onAddSearch,
  initialQuery,
  recentSearches,
  SignInRegisterButtons,
}: UploadViewProps) => {
  const isUploading =
    progress.status === 'uploading' || progress.status === 'processing'

  return (
    <div>
      <Header
        onSearch={onSearch}
        onAddSearch={onAddSearch}
        initialQuery={initialQuery}
        recentSearches={recentSearches}
        SignInRegisterButtons={SignInRegisterButtons}
      />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Upload Video</h1>

        <div className="space-y-6">
          <UploadForm
            form={form}
            onSubmit={onSubmit}
            isUploading={isUploading}
          />

          {progress.status !== 'idle' && <UploadProgress progress={progress} />}

          {uploadedVideo && progress.status === 'complete' && (
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {uploadedVideo.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {uploadedVideo.description}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild>
                      <Link href={uploadedVideo.url} target="_blank">
                        View on YouTube
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/">Go to Home</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
