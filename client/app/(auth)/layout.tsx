import { GuestGuard } from '@/components/common/GuestGuard'
import React from 'react'

const layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
     <GuestGuard>
      {children}
    </GuestGuard>
  )
}

export default layout