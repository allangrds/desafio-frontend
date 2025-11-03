'use client'

import { useUploadLogic } from './upload.hooks'
import { UploadView } from './upload.view'

type UploadContainerProps = {
  userMenuSlot: React.ReactNode
}

export const UploadContainer = ({ userMenuSlot }: UploadContainerProps) => {
  const {
    form,
    progress,
    uploadedVideo,
    onSubmit,
    onSearch,
    onAddSearch,
    initialQuery,
    recentSearches,
  } = useUploadLogic()

  return (
    <UploadView
      form={form}
      progress={progress}
      uploadedVideo={uploadedVideo}
      onSubmit={onSubmit}
      onSearch={onSearch}
      onAddSearch={onAddSearch}
      initialQuery={initialQuery}
      recentSearches={recentSearches}
      SignInRegisterButtons={userMenuSlot}
    />
  )
}
