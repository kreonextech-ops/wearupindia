'use client';

import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';
import BulkOrderModal from './BulkOrderModal';

export default function BulkOrderButton({ categoryName }: { categoryName: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-4 px-7 py-2.5 bg-foreground text-background font-display font-bold text-[10px] tracking-[0.3em] uppercase rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xl group/btn"
      >
        Contact for Bulk Orders <ClipboardList size={12} className="group-hover/btn:rotate-12 transition-transform" />
      </button>
      
      <BulkOrderModal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        categoryName={categoryName} 
      />
    </>
  );
}
