'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { Categories } from '@/types/supabase';

interface CategoryFilterProps {
  categories: Categories[];
  selectedCategory?: string | null;
}

export default function CategoryFilter({ categories, selectedCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = selectedCategory ?? searchParams.get('category');

  const handleCategorySelect = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('category', id);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
      <button
        onClick={() => handleCategorySelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
          !currentCategory
            ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
        }`}
      >
        All Products
      </button>
      {categories.map((category) => {
        const isActive = currentCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              isActive
                ? 'bg-primary text-primary-foreground font-semibold shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
