export default function CarCardSkeleton() {
  return (
    <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-64 bg-gray-200">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-gray-200" />
        {/* Price badge skeleton */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-lg">
          <div className="h-6 w-12 bg-gray-300 rounded" />
        </div>
        {/* Available badge skeleton */}
        <div className="absolute top-4 left-4">
          <div className="h-6 w-20 bg-green-100 rounded-full" />
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6 space-y-4">
        {/* Title skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-300 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
        
        {/* Features skeleton */}
        <div className="flex gap-4">
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
          <div className="h-8 w-8 bg-gray-200 rounded" />
        </div>
        
        {/* Description skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded" />
          <div className="h-3 bg-gray-200 rounded w-5/6" />
        </div>
        
        {/* Button skeleton */}
        <div className="h-12 bg-gray-300 rounded-xl mt-4" />
      </div>
    </div>
  );
}
