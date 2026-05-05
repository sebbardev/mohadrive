"use client";

export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image Skeleton */}
      <div className="relative h-64 bg-gray-200">
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <div className="bg-gray-300 px-5 py-3 rounded-2xl w-24 h-12" />
          <div className="bg-gray-300 px-4 py-2 rounded-xl w-20 h-8" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-8 space-y-6">
        {/* Title */}
        <div className="space-y-3">
          <div className="h-8 bg-gray-200 rounded-xl w-3/4" />
          <div className="h-1 w-12 bg-gray-200 rounded-full" />
        </div>

        {/* Specs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-2xl h-16" />
          <div className="bg-gray-100 p-4 rounded-2xl h-16" />
        </div>

        {/* Button */}
        <div className="pt-6 border-t border-gray-100">
          <div className="h-14 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
