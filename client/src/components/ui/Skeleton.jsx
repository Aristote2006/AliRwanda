import React from 'react'

const Skeleton = ({ className, variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded'
  
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-6 w-1/2',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
    card: 'h-32 w-full',
    image: 'h-48 w-full',
    thumbnail: 'h-16 w-16',
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className || ''}`} />
  )
}

const SkeletonCard = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
    <Skeleton variant="image" className="mb-4" />
    <Skeleton variant="title" className="mb-2" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" className="w-1/2" />
  </div>
)

const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Skeleton variant="thumbnail" />
        <Skeleton variant="text" className="flex-1" />
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="button" />
      </div>
    ))}
  </div>
)

const SkeletonList = ({ items = 5 }) => (
  <div className="space-y-4">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="title" />
          <Skeleton variant="text" />
        </div>
      </div>
    ))}
  </div>
)

export { Skeleton, SkeletonCard, SkeletonTable, SkeletonList }
export default Skeleton
