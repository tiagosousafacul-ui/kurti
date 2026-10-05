import React from 'react';

// Base Shimmer block
export const SkeletonShimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-pulse rounded-xl ${className}`} />
);

// 1. NOTICIAS SKELETON LOADER
export const NoticiasSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Featured Big News Banner Skeleton */}
      <div className="relative rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 min-h-[380px] p-6 sm:p-10 flex flex-col justify-end">
        <SkeletonShimmer className="absolute inset-0 w-full h-full rounded-none opacity-60" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2">
            <SkeletonShimmer className="w-24 h-6 rounded-full" />
            <SkeletonShimmer className="w-32 h-6 rounded-full" />
          </div>
          <SkeletonShimmer className="w-full max-w-2xl h-10 rounded-2xl" />
          <SkeletonShimmer className="w-4/5 h-6 rounded-xl" />
          <div className="flex items-center gap-4 pt-2">
            <SkeletonShimmer className="w-28 h-5 rounded-lg" />
            <SkeletonShimmer className="w-24 h-5 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Categories & Search Filter Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonShimmer key={i} className="h-9 w-28 shrink-0 rounded-xl" />
          ))}
        </div>
        <SkeletonShimmer className="h-10 w-full sm:w-64 rounded-xl" />
      </div>

      {/* Grid of News Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Image Aspect ratio skeleton */}
              <div className="relative aspect-[16/10] bg-neutral-100">
                <SkeletonShimmer className="w-full h-full rounded-none" />
                <SkeletonShimmer className="absolute top-3 left-3 w-20 h-5 rounded-full" />
              </div>

              {/* Card Content Skeleton */}
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <SkeletonShimmer className="w-20 h-4 rounded-md" />
                  <SkeletonShimmer className="w-16 h-4 rounded-md" />
                </div>
                <SkeletonShimmer className="w-full h-6 rounded-lg" />
                <SkeletonShimmer className="w-4/5 h-5 rounded-lg" />
                <div className="space-y-1.5 pt-2">
                  <SkeletonShimmer className="w-full h-4 rounded" />
                  <SkeletonShimmer className="w-5/6 h-4 rounded" />
                </div>
                {/* Tags */}
                <div className="flex gap-1.5 pt-2">
                  <SkeletonShimmer className="w-12 h-4 rounded-md" />
                  <SkeletonShimmer className="w-14 h-4 rounded-md" />
                  <SkeletonShimmer className="w-10 h-4 rounded-md" />
                </div>
              </div>
            </div>

            {/* Card Footer Skeleton */}
            <div className="p-5 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
              <SkeletonShimmer className="w-24 h-4 rounded" />
              <div className="flex gap-2">
                <SkeletonShimmer className="w-8 h-8 rounded-lg" />
                <SkeletonShimmer className="w-8 h-8 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. CULTURA SKELETON LOADER
export const CulturaSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Subtabs Selector Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <SkeletonShimmer className="w-8 h-8 rounded-xl" />
              <SkeletonShimmer className="w-36 h-5 rounded-lg" />
            </div>
            <SkeletonShimmer className="w-full h-3.5 rounded" />
          </div>
        ))}
      </div>

      {/* Grid of Events / Cinema / Theater Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              {/* Event Cover */}
              <div className="relative aspect-[16/10] bg-neutral-100">
                <SkeletonShimmer className="w-full h-full rounded-none" />
                <SkeletonShimmer className="absolute top-3 left-3 w-28 h-6 rounded-full" />
                <SkeletonShimmer className="absolute top-3 right-3 w-12 h-6 rounded-full" />
              </div>

              {/* Event Body */}
              <div className="p-6 space-y-3">
                <SkeletonShimmer className="w-full h-6 rounded-lg" />
                <SkeletonShimmer className="w-3/4 h-5 rounded-lg" />

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <SkeletonShimmer className="w-4 h-4 rounded-full" />
                    <SkeletonShimmer className="w-48 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonShimmer className="w-4 h-4 rounded-full" />
                    <SkeletonShimmer className="w-36 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonShimmer className="w-4 h-4 rounded-full" />
                    <SkeletonShimmer className="w-28 h-4 rounded" />
                  </div>
                </div>

                <SkeletonShimmer className="w-full h-12 rounded-xl mt-3" />
              </div>
            </div>

            {/* Event Footer Button */}
            <div className="p-6 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
              <SkeletonShimmer className="w-20 h-5 rounded" />
              <SkeletonShimmer className="w-32 h-9 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. KURTI PLUS SKELETON LOADER
export const KurtiPlusSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Category Subtabs Scroll Skeleton */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-200">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <SkeletonShimmer key={i} className="h-10 w-36 shrink-0 rounded-2xl" />
        ))}
      </div>

      {/* Content Header Banner Skeleton */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xs">
        <SkeletonShimmer className="w-32 h-4 rounded" />
        <SkeletonShimmer className="w-2/3 h-8 rounded-xl" />
        <SkeletonShimmer className="w-full max-w-xl h-4 rounded" />
      </div>

      {/* Grid of Lifestyle / Sports / Recipe Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/10] bg-neutral-100">
                <SkeletonShimmer className="w-full h-full rounded-none" />
                <SkeletonShimmer className="absolute top-3 left-3 w-24 h-5 rounded-full" />
              </div>

              <div className="p-6 space-y-3">
                <SkeletonShimmer className="w-3/4 h-6 rounded-lg" />
                <SkeletonShimmer className="w-full h-4 rounded" />
                <SkeletonShimmer className="w-5/6 h-4 rounded" />

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2">
                    <SkeletonShimmer className="w-4 h-4 rounded-full" />
                    <SkeletonShimmer className="w-40 h-4 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <SkeletonShimmer className="w-4 h-4 rounded-full" />
                    <SkeletonShimmer className="w-32 h-4 rounded" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-neutral-100 mt-4 flex items-center justify-between">
              <SkeletonShimmer className="w-24 h-4 rounded" />
              <SkeletonShimmer className="w-28 h-8 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
