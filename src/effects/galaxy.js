export const galaxy = {
  name: 'galaxy',
  icon: 'mdi:galaxy',
  label: 'galaxy',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cx = w / 2, cy = h / 2;
    const chars = ' .:;~=+*#%@';
    let t = 0;
    
    // Optimized star field with fewer stars but better distribution
    const stars = Array.from({ length: Math.floor(w * h * 0.03) }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      brightness: 0.3 + Math.random() * 0.7,
      twinkle: Math.random() * Math.PI * 2,
      speed: 0.05 + Math.random() * 0.1
    }));

    const step = () => {
      t += 0.08; // Faster animation
      
      // Pre-calculate star positions for performance
      const starGrid = Array.from({ length: h }, () => Array(w).fill(0));
      for (const star of stars) {
        const x = Math.floor(star.x);
        const y = Math.floor(star.y);
        if (x >= 0 && x < w && y >= 0 && y < h) {
          const twinkle = Math.sin(star.twinkle + t * 2) * 0.4 + 0.6;
          starGrid[y][x] = Math.max(starGrid[y][x], star.brightness * twinkle);
        }
      }
      
      // Create galaxy spiral pattern with proper alignment
      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const r = Math.hypot(dx, dy);
          
          // Use continuous spiral calculation based on radius and time
          const spiralPhase = r * 0.1 - t * 0.5;
          const spiral1 = Math.sin(spiralPhase) * 0.5 + 0.5;
          const spiral2 = Math.sin(spiralPhase * 1.3) * 0.5 + 0.5;
          
          // Radial density with smooth falloff
          const radialDensity = Math.exp(-r * 0.02) * Math.max(0, 1 - r / Math.max(w, h) * 0.7);
          
          // Combine spirals
          const intensity = (spiral1 * 0.6 + spiral2 * 0.4) * radialDensity;
          
          // Add star field
          const starBrightness = starGrid[y][x];
          
          // Combine galaxy and stars with better contrast
          const finalIntensity = Math.min(1, intensity + starBrightness * 0.9);
          
          if (finalIntensity <= 0.08) {
            out += ' ';
          } else {
            const ci = Math.min(chars.length - 1, Math.max(1, Math.floor(finalIntensity * (chars.length - 1))));
            out += chars[ci];
          }
        }
        if (y < h - 1) out += '\n';
      }
      
      // Update star twinkling
      for (const star of stars) {
        star.twinkle += star.speed;
      }

      pre.textContent = out;
      this.loopId = requestAnimationFrame(step);
    };

    this.loopId = 0;
    step();
  },
  stop() {
    if (this.loopId) {
      cancelAnimationFrame(this.loopId);
      this.loopId = 0;
    }
  }
};
