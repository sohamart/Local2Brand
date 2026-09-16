import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function Root() {
  useEffect(() => {
    // Disable browser default scroll restoration so routes always start at top
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Supreme Awwwards & Apple ProMotion Grade Smooth Scroll Engine (Studio Freight Lenis)
    const lenis = new Lenis({
      duration: 1.2, // Luxurious, buttery-smooth floating momentum
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential deceleration curve
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0, // Buttery smooth wheel travel
      touchMultiplier: 1.0, // Responsive 1:1 mobile touch
      syncTouch: false, // Pure hardware-accelerated momentum
      autoResize: true,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Dedicated requestAnimationFrame loop for pure 60/120/144 FPS screen sync
    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    window.lenis = lenis;

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
