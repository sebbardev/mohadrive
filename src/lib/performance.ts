/**
 * Performance monitoring utility
 * Track and log key performance metrics
 */

export function measurePerformance() {
  if (typeof window === 'undefined') return;

  // Track Page Load Time
  window.addEventListener('load', () => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      const startTime = navigation.startTime || 0;
      const metrics = {
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnection: navigation.connectEnd - navigation.connectStart,
        timeToFirstByte: navigation.responseStart - navigation.requestStart,
        pageDownload: navigation.responseEnd - navigation.responseStart,
        domInteractive: navigation.domInteractive - startTime,
        domContentLoaded: navigation.domContentLoadedEventEnd - startTime,
        pageLoad: navigation.loadEventEnd - startTime,
      };

      console.log('📊 Performance Metrics:', metrics);
      
      // Log warnings for slow metrics
      if (metrics.pageLoad > 3000) {
        console.warn('⚠️ Slow page load time:', metrics.pageLoad, 'ms');
      }
      
      if (metrics.timeToFirstByte > 600) {
        console.warn('⚠️ Slow server response time:', metrics.timeToFirstByte, 'ms');
      }
    }
  });

  // Track Largest Contentful Paint (LCP)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('🎨 Largest Contentful Paint (LCP):', lastEntry.startTime, 'ms');
        
        if (lastEntry.startTime > 2500) {
          console.warn('⚠️ Poor LCP score. Should be < 2.5s');
        }
      });
      
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    // Track First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('👆 First Input Delay (FID):', entry.processingStart - entry.startTime, 'ms');
          
          if (entry.processingStart - entry.startTime > 100) {
            console.warn('⚠️ Poor FID score. Should be < 100ms');
          }
        });
      });
      
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    try {
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            console.log('📐 Cumulative Layout Shift (CLS):', clsValue);
            
            if (clsValue > 0.1) {
              console.warn('⚠️ Poor CLS score. Should be < 0.1');
            }
          }
        });
      });
      
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS not supported
    }
  }
}

// Track API call performance
export function trackAPICall(url: string, startTime: number) {
  const duration = Date.now() - startTime;
  console.log(`🌐 API Call: ${url} - ${duration}ms`);
  
  if (duration > 1000) {
    console.warn(`⚠️ Slow API call: ${url} took ${duration}ms`);
  }
  
  return duration;
}
