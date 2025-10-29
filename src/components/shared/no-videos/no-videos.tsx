import { Video } from 'lucide-react'

import { Button } from '@/components/ui/button'

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

export const NoVideos = () => (
  <Empty className="border border-dashed">
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <Video />
      </EmptyMedia>
      <EmptyTitle>No videos found</EmptyTitle>
      <EmptyDescription>
        There are no videos to display at the moment. Please check back later or
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
)
