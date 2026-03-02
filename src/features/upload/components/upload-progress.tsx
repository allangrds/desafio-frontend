'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { UploadProgress as UploadProgressType } from '@/types/youtube'

type UploadProgressProps = {
  progress: UploadProgressType
}

export const UploadProgress = ({ progress }: UploadProgressProps) => {
  if (progress.status === 'idle') {
    return null
  }

  const getStatusText = () => {
    switch (progress.status) {
      case 'uploading':
        return 'Uploading...'
      case 'processing':
        return 'Processing...'
      case 'complete':
        return 'Complete!'
      case 'error':
        return 'Error'
      default:
        return ''
    }
  }

  const getStatusColor = () => {
    switch (progress.status) {
      case 'uploading':
        return 'text-blue-600'
      case 'processing':
        return 'text-yellow-600'
      case 'complete':
        return 'text-green-600'
      case 'error':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <span className="text-sm text-gray-500">
              {progress.percentage}%
            </span>
          </div>

          {progress.status !== 'error' && (
            <Progress value={progress.percentage} className="h-2 mb-4" />
          )}

          {progress.status === 'error' && progress.message && (
            <p className="text-sm text-red-600">{progress.message}</p>
          )}

          {progress.status === 'complete' && (
            <p className="text-sm text-green-600">
              Your video has been uploaded successfully!
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
