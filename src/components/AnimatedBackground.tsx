"use client";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedBackground({ children, className = "" }: AnimatedBackgroundProps) {
  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {/* Animated background elements - Full page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[300px] sm:w-[500px] md:w-[700px] lg:w-[800px] h-[300px] sm:h-[500px] md:h-[700px] lg:h-[800px] bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-secondary)]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[200px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[200px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gradient-to-tr from-[var(--color-highlight)]/10 to-[var(--color-accent)]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'radial-gradient(circle, var(--color-primary) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
