import type { Metadata } from 'next'

import { Upload } from '@/features/upload/upload'

export const metadata: Metadata = {
  title: 'YouTube Clone | Upload Video',
  description: 'Upload your video to YouTube',
}

const UploadPage = () => {
  return <Upload />
}

export default UploadPage
