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
    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.slice(0, 3).map((product: Product) => (
        <motion.div
          key={product.id}
          variants={itemVariants}
          style={{ opacity: 1 }}
          className="w-full"
        >
          <Link href={`/product/${product.id}`}>
            <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white relative">
              <img
                src={product.imageUrl || "/api/placeholder/300/200"}
                alt={language === "ko" ? product.nameKo : product.name}
                className="w-full h-48 object-cover"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = "/api/placeholder/300/200";
                }}
              />
              
              {/* HOT Badge - Only for featured products */}
              {product.isFeatured && (
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                  HOT
                </div>
              )}
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}