import CarCardSkeleton from "@/components/cars/CarCardSkeleton";

export default function Loading() {
  return (
    <div className="bg-gradient-to-b from-[var(--color-bg)] via-white to-[var(--color-bg)] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="h-6 bg-gray-200 rounded-full w-48 mx-auto mb-4" />
          <div className="h-12 bg-gray-200 rounded-2xl w-96 max-w-full mx-auto mb-4" />
          <div className="h-4 bg-gray-200 rounded-xl w-80 max-w-full mx-auto" />
        </div>

        {/* Filters and Grid Skeleton */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-lg animate-pulse">
              <div className="h-8 bg-gray-200 rounded-xl w-32 mb-8" />
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
                    <div className="space-y-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-10 bg-gray-100 rounded-xl" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Car Grid Skeleton */}
          <div className="lg:w-3/4">
            <div className="mb-8">
              <div className="h-8 bg-gray-200 rounded-xl w-48 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
