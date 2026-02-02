'use client';

import Image from 'next/image';

export default function LogoPremium() {
  return (
    <div className="relative group cursor-pointer">
      <div className="flex items-center gap-2">
        <Image 
          src="/images/Logo.png" 
          alt="BYZCLUB Logo" 
          width={180} 
          height={64}
          className="h-auto w-auto max-h-14 md:max-h-16 transition-transform duration-300 group-hover:scale-105"
          priority
        />
      </div>
    </div>
  );
}
