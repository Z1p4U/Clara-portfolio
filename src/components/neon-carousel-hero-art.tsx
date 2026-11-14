"use client";

import dynamic from "next/dynamic";

const NeonCarousel3D = dynamic(() => import("./NeonCarousel3D"), { ssr: false });

export function NeonCarouselHeroArt() {
  return <NeonCarousel3D className="neon-carousel-art" speed={0.35} height="var(--carousel-art-height)" />;
}
