
import React from 'react';
import { Balloon } from '../lib/types';

interface Props {
  panelRef: HTMLDivElement | null;
  balloonRef: HTMLDivElement | null;
  b: Balloon;
}

export default function TailOverlaySVG({ panelRef, balloonRef, b }: Props) {
  if (!panelRef || !balloonRef || !b.tail.on) return null;

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-[1]">
      <path 
        d={`M ${b.x + (b.w/2)} ${b.y + 10} L ${b.tail.tx} ${b.tail.ty}`}
        stroke="white"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path 
        d={`M ${b.x + (b.w/2)} ${b.y + 10} L ${b.tail.tx} ${b.tail.ty}`}
        stroke="#000"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
