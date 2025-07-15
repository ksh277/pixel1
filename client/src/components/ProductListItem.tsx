import { useLanguage } from "@/hooks/useLanguage";
import type { Product } from "@shared/schema";

interface ProductListItemProps {
  product: Product & { reviewCount?: number };
}

export function ProductListItem({ product }: ProductListItemProps) {
  const { language } = useLanguage();
  return (
    <div className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-16 h-16 rounded object-cover"
        />
        <div>
          <h4 className="font-semibold text-sm">
            {language === "ko" ? product.nameKo : product.name}
          </h4>
          <p className="text-xs text-gray-500">
            ₩ {parseInt(product.basePrice).toLocaleString()}부터
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400">
        리뷰 {product.reviewCount?.toLocaleString() ?? 0}
      </span>
    </div>
  );
}
