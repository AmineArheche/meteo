// LoadingSkeleton.jsx - Effet de chargement animé Shimmer
import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="relative z-10 w-full space-y-6 animate-pulse">
      {/* Current Weather Card Skeleton */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-white/10 rounded-xl shimmer-effect" />
            <div className="h-4 w-32 bg-white/10 rounded-lg shimmer-effect" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 w-28 bg-white/10 rounded-full shimmer-effect" />
              <div className="h-6 w-20 bg-white/10 rounded-full shimmer-effect" />
            </div>
          </div>

          <div className="flex items-center gap-6 justify-end">
            <div className="w-20 h-20 bg-white/10 rounded-2xl shimmer-effect" />
            <div className="space-y-2">
              <div className="h-14 w-28 bg-white/10 rounded-2xl shimmer-effect" />
              <div className="h-4 w-24 bg-white/10 rounded-lg shimmer-effect ml-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="glass-panel rounded-3xl p-4">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="min-w-[5.5rem] h-28 bg-white/5 rounded-2xl shimmer-effect" />
          ))}
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 h-36 space-y-3">
            <div className="h-4 w-24 bg-white/10 rounded-lg shimmer-effect" />
            <div className="h-8 w-28 bg-white/15 rounded-xl shimmer-effect" />
            <div className="h-3 w-full bg-white/10 rounded-full shimmer-effect" />
          </div>
        ))}
      </div>
    </div>
  );
}
