import type { Metadata } from 'next'

import { Upload } from '@/features/upload/upload'

export const metadata: Metadata = {
  title: 'Upload Video | YouTube Clone',
  description: 'Upload your video to YouTube',
}

const UploadPage = () => {
  return <Upload />
}

export default UploadPage
