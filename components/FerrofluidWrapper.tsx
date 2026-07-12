'use client'

import dynamic from "next/dynamic";

const Ferrofluid = dynamic(() => import("@/components/Ferrofluid"), {
  ssr: false,
});

export default function FerrofluidWrapper() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.3] select-none">
      <Ferrofluid
        colors={['#18181A', '#1a1a2e', '#C84B31', '#B3985E']}
        speed={0.25}
        scale={1.2}
        turbulence={0.8}
        fluidity={0.12}
        shimmer={2.5}
        glow={3}
        rimWidth={0.25}
        mouseInteraction={true}
        mouseRadius={0.4}
        mouseDampening={0.1}
      />
    </div>
  );
}
