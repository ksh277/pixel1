import { useState } from "react";
import { Heart, ShoppingCart, Eye, ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/useLanguage";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product & { reviewCount?: number; likeCount?: number };
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  isFavorite?: boolean;
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(isFavorite);
  const { language, t } = useLanguage();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onToggleFavorite?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const formattedPrice = parseInt(product.basePrice).toLocaleString();
  const reviewCount = product.reviewCount || 0;
  const likeCount = product.likeCount || 0;

  return (
    <Link href={`/product/${product.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="allprint-card"
      >
        <div className="allprint-card-image">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} loading="lazy" />
          ) : (
            <div className="allprint-card-image-placeholder">
              <ImageIcon className="w-full h-28 object-contain mx-auto text-gray-300 dark:text-gray-700" />
            </div>
          )}

          {product.isFeatured && (
            <div className="allprint-card-hot-badge">HOT</div>
          )}

          <div className="allprint-card-like-badge">LIKE {likeCount || 15}</div>
        </div>

        <div className="allprint-card-content">
          <div className="allprint-card-title">
            {language === "ko" ? product.nameKo : product.name}
          </div>
          <div className="allprint-card-price">₩ {formattedPrice}</div>
          <div className="allprint-card-stats">
            리뷰 {reviewCount?.toLocaleString() || "11,390"} / LIKE{" "}
            {likeCount || 15}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
