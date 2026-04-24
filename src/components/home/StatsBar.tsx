'use client';

import { useRef, useEffect, useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

const stats = [
  { value: 1200, suffix: '+', label: 'Wraps Completed', prefix: '' },
  { value: 9800, suffix: '+', label: 'Happy Customers', prefix: '' },
  { value: 4.9, suffix: '★', label: 'Reviews', prefix: '', decimal: true },
  { value: 50, suffix: '+', label: 'Cities Across India', prefix: '' },
];

function AnimatedNumber({ target, suffix, prefix, decimal }: { target: number; suffix: string; prefix: string; decimal?: boolean }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 80;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = decimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString('en-IN');

  return (
    <div ref={ref} className="font-display font-black text-3xl sm:text-4xl text-foreground leading-none tracking-tight">
      {prefix}{display}{suffix}
    </div>
  );
}

export default function StatsBar() {
  return (
    <section className="border-y border-border bg-muted py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-0">
          {stats.map((stat, i) => (
            <ScrollReveal key={i} direction="up" delay={i * 0.1}>
              <div className={`flex flex-col items-center text-center group py-2 ${i < stats.length - 1 ? 'md:border-r border-border' : ''}`}>
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimal={stat.decimal}
                />
                <p className="font-mono text-[9px] tracking-[0.25em] text-muted-foreground uppercase mt-2">
                  {stat.label}
                </p>
                <div className="mt-2 w-4 h-px bg-wu-red/40 group-hover:w-10 transition-all duration-700" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
