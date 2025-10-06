export const snow = {
  name: 'snow',
  icon: 'solar:snowflake-bold',
  label: 'snow',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const n = Math.floor(w * h * 0.02) || 80;
    const parts = Array.from({ length: n }, () => ({ 
      x: Math.random() * w, 
      y: Math.random() * h, 
      vy: 0.2 + Math.random() * 1.2, 
      chr: ['*', '❅', '.', '•', '✻'][Math.random() * 5 | 0] 
    }));
    
    const step = () => {
      let grid = Array.from({ length: h }, () => Array(w).fill(' '));
      for (const p of parts) {
        p.y += p.vy;
        p.x += Math.sin(p.y * 0.5 + performance.now() * 0.002) * 0.5;
        if (p.y >= h) { 
          p.y = 0; 
          p.x = Math.random() * w; 
          p.vy = 0.2 + Math.random() * 1.2; 
          p.chr = ['*', '❅', '.', '•', '✻'][Math.random() * 5 | 0]; 
        }
        const xi = (p.x | 0 + w) % w, yi = p.y | 0;
        grid[yi][xi] = p.chr;
      }
      pre.textContent = grid.map(r => r.join('')).join('\n');
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
