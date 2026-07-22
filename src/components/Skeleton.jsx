export function SkeletonCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/40 animate-pulse">
      <div className="aspect-[2/3] bg-zinc-800" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-12 bg-zinc-800 rounded" />
        <div className="h-3 w-3/4 bg-zinc-800 rounded" />
        <div className="flex justify-between">
          <div className="h-2 w-8 bg-zinc-800 rounded" />
          <div className="h-2 w-10 bg-zinc-800 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[550px] md:h-[650px] w-full bg-zinc-950 animate-pulse">
      <div className="absolute inset-0 bg-zinc-900" />
      <div className="absolute bottom-16 left-16 space-y-4 max-w-xl">
        <div className="h-4 w-40 bg-zinc-800 rounded" />
        <div className="h-12 w-96 bg-zinc-800 rounded" />
        <div className="flex gap-4">
          <div className="h-4 w-20 bg-zinc-800 rounded" />
          <div className="h-4 w-16 bg-zinc-800 rounded" />
          <div className="h-4 w-14 bg-zinc-800 rounded" />
        </div>
        <div className="h-16 w-full bg-zinc-800 rounded" />
        <div className="flex gap-4 pt-2">
          <div className="h-12 w-48 bg-zinc-800 rounded-full" />
          <div className="h-12 w-48 bg-zinc-800 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
        <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
      </div>
      <SkeletonGrid count={6} />
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="px-6 md:px-16 py-12 space-y-12 animate-pulse">
      <div className="relative rounded-3xl overflow-hidden min-h-[350px] md:h-[450px] bg-zinc-900">
        <div className="absolute bottom-12 left-12 flex gap-8 items-end w-full">
          <div className="w-36 md:w-52 aspect-[2/3] bg-zinc-800 rounded-2xl" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-zinc-800 rounded" />
              <div className="h-5 w-12 bg-zinc-800 rounded" />
            </div>
            <div className="h-10 w-64 bg-zinc-800 rounded" />
            <div className="h-4 w-96 bg-zinc-800 rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-8 w-64 bg-zinc-800 rounded animate-pulse" />
          <div className="aspect-video bg-zinc-800 rounded-2xl" />
        </div>
        <div className="space-y-4">
          <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
          <div className="h-40 bg-zinc-800 rounded-2xl" />
          <div className="h-40 bg-zinc-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
