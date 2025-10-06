export const sparks = {
  name: 'sparks',
  icon: 'fluent:sparkle-16-filled',
  label: 'sparks',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const n = Math.floor(w * h * 0.01) || 60;
    const parts = [];
    
    const step = () => {
      if (parts.length < n && Math.random() > 0.3) {
        parts.push({ 
          x: Math.random() * w, 
          y: h - 1, 
          vy: -(0.5 + Math.random() * 2), 
          chr: ['.', '*', '+', '•'][Math.random() * 4 | 0], 
          life: 20 + (Math.random() * 40 | 0) 
        });
      }
      let grid = Array.from({ length: h }, () => Array(w).fill(' '));
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.y += p.vy;
        p.x += Math.sin(performance.now() * 0.001 + i) * 0.3;
        p.vy += 0.02; 
        p.life--;
        if (p.life <= 0 || p.y < 0) { 
          parts.splice(i, 1); 
          continue; 
        }
        const xi = Math.max(0, Math.min(w - 1, p.x | 0)), yi = Math.max(0, Math.min(h - 1, p.y | 0));
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
