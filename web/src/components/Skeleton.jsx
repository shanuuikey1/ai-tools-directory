import React from 'react';

/**
 * Skeleton loading component with shimmer animation.
 * Use the `className` prop to pass Tailwind classes for sizing.
 */
export function Skeleton({ className = '', circle = false, count = 1 }) {
  const base = circle
    ? 'rounded-full'
    : 'rounded-lg';

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] ${base} ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm" aria-hidden="true">
      <div className="flex items-start space-x-4">
        <Skeleton className="w-14 h-14 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="space-y-1" aria-hidden="true">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}

export function SkeletonTestimonial() {
  return (
    <div className="bg-white border border-gray-100 p-8 rounded-2xl" aria-hidden="true">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-5/6" />
    </div>
  );
}

export default Skeleton;
