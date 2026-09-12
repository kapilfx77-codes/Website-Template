/**
 * ProductGrid — Responsive grid for ProductCard components with skeleton states
 */

import ProductCard, { ProductCardProps } from './ProductCard';

export interface ProductGridProps {
  products: ProductCardProps[];
  loading?: boolean;
}

function SkeletonCard() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="h-56 bg-slate-200" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="h-5 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-8 rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  const count = products.length;

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      {count === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-20 text-center">
          <h3 className="text-lg font-semibold text-slate-700">No products found</h3>
          <p className="mt-2 text-sm text-slate-500">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductGrid;/* Skeleton fallback already present */
