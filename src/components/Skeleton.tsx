import React from "react";
import { motion } from "motion/react";

interface SkeletonProps {
  type?: "grid" | "detail" | "form" | "home";
}

export default function Skeleton({ type = "grid" }: SkeletonProps) {
  const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-cream/10 before:to-transparent bg-chocolate-light/40 border border-cream/5";

  if (type === "home") {
    return (
      <div className="w-full space-y-12 py-8 px-6 max-w-7xl mx-auto">
        {/* Hero Banner Skeleton */}
        <div className={`w-full aspect-[3/2] rounded-2xl ${shimmerClass}`} />
        
        {/* Title Block */}
        <div className="space-y-3 max-w-sm mx-auto flex flex-col items-center">
          <div className={`h-8 w-48 rounded-lg ${shimmerClass}`} />
          <div className={`h-1 w-12 rounded ${shimmerClass}`} />
        </div>

        {/* Collection Grid Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center space-y-4">
              <div className={`w-full aspect-[3/4] rounded-2xl ${shimmerClass}`} />
              <div className={`h-6 w-36 rounded-md ${shimmerClass}`} />
              <div className={`h-3 w-24 rounded-md ${shimmerClass}`} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "detail") {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image Panel */}
        <div className="space-y-4">
          <div className={`w-full aspect-[3/4] rounded-2xl ${shimmerClass}`} />
          <div className="flex space-x-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`w-20 h-24 rounded-xl ${shimmerClass}`} />
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <div className={`h-4 w-24 rounded-md ${shimmerClass}`} />
            <div className={`h-10 w-3/4 rounded-lg ${shimmerClass}`} />
            <div className={`h-6 w-32 rounded-md ${shimmerClass}`} />
          </div>

          <div className="space-y-3 pt-6 border-t border-cream/5">
            <div className={`h-4 w-28 rounded-md ${shimmerClass}`} />
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-12 h-10 rounded-lg ${shimmerClass}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-cream/5">
            <div className={`h-24 w-full rounded-xl ${shimmerClass}`} />
          </div>

          <div className="flex space-x-4 pt-6">
            <div className={`h-14 flex-1 rounded-xl ${shimmerClass}`} />
            <div className={`h-14 w-14 rounded-full ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  if (type === "form") {
    return (
      <div className="w-full max-w-4xl mx-auto px-6 py-12 space-y-8">
        <div className="space-y-2">
          <div className={`h-8 w-48 rounded-md ${shimmerClass}`} />
          <div className={`h-4 w-72 rounded-md ${shimmerClass}`} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-cream/5">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className={`h-4 w-20 rounded ${shimmerClass}`} />
              <div className={`h-12 w-full rounded-xl ${shimmerClass}`} />
            </div>
            <div className="space-y-2">
              <div className={`h-4 w-24 rounded ${shimmerClass}`} />
              <div className={`h-32 w-full rounded-xl ${shimmerClass}`} />
            </div>
          </div>

          <div className="space-y-6">
            <div className={`w-full aspect-[3/4] rounded-2xl ${shimmerClass}`} />
          </div>
        </div>
      </div>
    );
  }

  // Default Grid Type (e.g. Shop, ApparelPage, FragrancesPage, BagsAndAccessoriesPage)
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Title */}
      <div className="space-y-3 mb-12 max-w-sm mx-auto flex flex-col items-center">
        <div className={`h-8 w-40 rounded-lg ${shimmerClass}`} />
        <div className={`h-3 w-28 rounded-md ${shimmerClass}`} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col space-y-4">
            <div className={`w-full aspect-[3/4] rounded-2xl ${shimmerClass}`} />
            <div className="space-y-2 flex flex-col items-center">
              <div className={`h-5 w-3/4 rounded-md ${shimmerClass}`} />
              <div className={`h-4 w-1/2 rounded-md ${shimmerClass}`} />
              <div className={`h-3 w-1/3 rounded-md ${shimmerClass}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
