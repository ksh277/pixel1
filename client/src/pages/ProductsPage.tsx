import React from 'react'
import ProductsGrid from '@/components/ProductsGrid'

const ProductsPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            상품 목록
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Supabase에서 불러온 상품들을 확인하세요
          </p>
        </div>

        {/* Products Grid */}
        <ProductsGrid pageSize={12} />
      </div>
    </div>
  )
}

export default ProductsPage