import { Card, CardContent } from "@/components/ui/card";

interface ProductCardSkeletonProps {
  count?: number;
  className?: string;
  gridClassName?: string;
}

export function ProductCardSkeleton({
  count = 4,
  className = "",
  gridClassName = "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
}: ProductCardSkeletonProps) {
  return (
    <div className={`${gridClassName} ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <Card
          key={index}
          className="bg-white shadow-sm overflow-hidden border border-gray-100 animate-pulse"
        >
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <div className="absolute top-2 left-2 z-10">
                <div className="bg-gray-300 text-transparent text-xs font-bold px-2 py-1 rounded">
                  HOT
                </div>
              </div>
              <div className="absolute top-2 right-2 z-10">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
              <div className="w-full h-full bg-gray-300"></div>
            </div>
            <div className="p-3 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-gray-300 rounded"></div>
                  ))}
                </div>
                <div className="h-3 bg-gray-300 rounded w-8"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-300 rounded w-12"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
