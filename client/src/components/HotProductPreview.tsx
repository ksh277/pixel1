import { Link } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import type { Product } from "@shared/schema";

interface HotProductPreviewProps {
  products: Product[];
}

export function HotProductPreview({ products }: HotProductPreviewProps) {
  const { language } = useLanguage();

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.slice(0, 3).map((product: Product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          style={{ opacity: 1 }}
          className="w-full"
        >
          <Link href={`/product/${product.id}`}>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              {/* Large Product Image */}
              <div className="relative">
                <img
                  src={product.imageUrl || "/api/placeholder/400/300"}
                  alt={language === "ko" ? product.nameKo : product.name}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/api/placeholder/400/300";
                  }}
                />
                
                {/* HOT Badge */}
                {product.isFeatured && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    HOT
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {language === "ko" ? product.nameKo : product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">
                    ₩{parseInt(product.basePrice).toLocaleString()}
                  </span>
                  
                  <div className="text-sm text-gray-500">
                    리뷰 {product.reviewCount?.toLocaleString() || "1,234"}
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  LIKE {product.likeCount || 45}
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}