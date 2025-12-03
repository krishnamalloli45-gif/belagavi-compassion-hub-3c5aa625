import { useEffect, useState, useRef } from "react";

const impactStats = [
  { value: 10000, label: "Lives Impacted", suffix: "+" },
  { value: 500, label: "Active Volunteers", suffix: "+" },
  { value: 150, label: "Events Organized", suffix: "+" },
  { value: 50, label: "Partner NGOs", suffix: "+" },
  { value: 25, label: "Villages Reached", suffix: "+" },
  { value: 15, label: "Years of Service", suffix: "" },
];

function AnimatedCounter({ 
  target, 
  suffix, 
  isVisible 
}: { 
  target: number; 
  suffix: string; 
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return (
    <span className="font-display text-4xl sm:text-5xl text-primary-foreground">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function ImpactSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 gradient-hero relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium mb-6">
            Our Impact
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-primary-foreground mb-6">
            Making a Real Difference
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Our journey of impact continues to grow with your support. 
            Here's what we've achieved together.
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {impactStats.map((stat, index) => (
            <div
              key={stat.label}
              className="glass-dark rounded-2xl p-6 text-center"
            >
              <AnimatedCounter 
                target={stat.value} 
                suffix={stat.suffix}
                isVisible={isVisible}
              />
              <p className="text-primary-foreground/70 text-sm mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
