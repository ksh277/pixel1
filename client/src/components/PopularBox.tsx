import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import type { Product } from "@shared/schema";

interface PopularBoxProps {
  title: string;
  description: string;
  image: string;
  products: Product[];
  bgColor?: string;
}

export function PopularBox({ title, description, image, products, bgColor = "bg-gray-50" }: PopularBoxProps) {
  const { language } = useLanguage();

  return (
    <div className={`${bgColor} dark:bg-black p-6 rounded-lg shadow-sm border dark:border-gray-700`}>
      {/* Main Image */}
      <div className="mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover rounded-md"
          onError={(e) => {
            e.currentTarget.src = "/api/placeholder/400/300";
          }}
        />
      </div>

      {/* Title and Description */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#222] dark:text-white mb-2">{title}</h3>
        <p className="text-base font-medium text-[#222] dark:text-gray-300">{description}</p>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.slice(0, 3).map((product) => (
          <Link key={product.id} href={`/product/${product.id}`}>
            <div className="flex items-center justify-between p-3 bg-white dark:bg-black rounded-md hover:shadow-md transition-shadow cursor-pointer border border-gray-100 dark:border-gray-600">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                  <img
                    src={product.imageUrl || "/api/placeholder/40/40"}
                    alt={product.name}
                    className="w-8 h-8 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/api/placeholder/40/40";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#222] dark:text-white truncate">
                    {language === "ko" ? product.nameKo : product.name}
                  </p>
                  <p className="text-xs font-medium text-[#555] dark:text-gray-400">
                    리뷰 {product.reviewCount?.toLocaleString() || "123"} / LIKE {product.likeCount || 45}
                  </p>
                </div>
              </div>
              <div className="text-sm font-semibold text-blue-600 dark:text-white">
                ₩{parseInt(product.basePrice).toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View More Link */}
      <div className="mt-4 text-center">
        <Link href="/products">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold">
            더 많은 상품 보기 →
          </button>
        </Link>
      </div>
    </div>
  );
}