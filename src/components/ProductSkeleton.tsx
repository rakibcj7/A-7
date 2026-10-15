import { cn } from '@/lib/utils';

export function ProductSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(
      'bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_1px_2px_rgba(17,17,17,0.04)]',
      'overflow-hidden animate-pulse', className
    )}>
      <div className="aspect-square bg-[#F3F4F6]" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-[#E5E7EB] rounded w-3/4" />
        <div className="h-4 bg-[#E5E7EB] rounded w-1/2" />
        <div className="h-4 bg-[#E5E7EB] rounded w-1/3 mt-4" />
        <div className="h-6 bg-[#E5E7EB] rounded w-2/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
            return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}