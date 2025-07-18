import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 결과 페이지로 이동
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-[#1e2b3c] border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            상품 검색
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="상품명을 입력하세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"
            >
              취소
            </Button>
            <Button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              검색
            </Button>
          </div>
        </form>
        
        {/* 인기 검색어 */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            인기 검색어
          </p>
          <div className="flex flex-wrap gap-2">
            {['키링', '핸드폰 케이스', '스티커', '뱃지', '아크릴'].map((term) => (
              <Button
                key={term}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery(term);
                  // 자동으로 검색 실행
                  window.location.href = `/search?q=${encodeURIComponent(term)}`;
                  onClose();
                }}
                className="text-xs px-2 py-1 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};