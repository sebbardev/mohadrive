export default function Loading() {
  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      {/* Hero Section Skeleton */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="container-custom">
          {/* Back button skeleton */}
          <div className="h-10 bg-gray-200 rounded-2xl w-32 mb-8 animate-pulse" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left Column: Media Skeleton */}
            <div className="space-y-6">
              {/* Title skeleton */}
              <div className="space-y-4 animate-pulse">
                <div className="h-5 bg-gray-200 rounded-full w-24" />
                <div className="h-16 bg-gray-200 rounded-2xl w-full" />
                <div className="h-1 w-16 bg-gray-200 rounded-full" />
              </div>

              {/* Main image skeleton */}
              <div className="relative h-[350px] sm:h-[500px] md:h-[600px] w-full bg-gray-200 rounded-[2rem] sm:rounded-[3rem] animate-pulse" />
              
              {/* Thumbnail gallery skeleton */}
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 sm:h-28 bg-gray-200 rounded-xl sm:rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>

            {/* Right Column: Information Skeleton */}
            <div className="space-y-6 sm:space-y-8">
              {/* Price card skeleton */}
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-xl animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-200 rounded w-32" />
                    <div className="h-16 bg-gray-200 rounded-xl w-40" />
                  </div>
                  <div className="h-16 sm:h-20 w-16 sm:w-20 bg-gray-200 rounded-[1.5rem] sm:rounded-[2rem]" />
                </div>
                <div className="h-14 bg-gray-200 rounded-2xl" />
                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                  <div className="h-4 bg-gray-200 rounded w-24" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </div>

              {/* Description skeleton */}
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-lg animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>

              {/* Specifications skeleton */}
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-lg animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-40 mb-8" />
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Features skeleton */}
              <div className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-lg animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded-xl sm:rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
