export const radar = {
  name: 'radar',
  icon: 'solar:radar-bold',
  label: 'radar',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cx = w / 2, cy = h / 2;
    let ang = 0;
    
    const step = () => {
      ang += 0.12;
      let grid = Array.from({ length: h }, () => Array(w).fill(' '));
      
      for (let i = 0; i < 200; i++) {
        const r = Math.random() * Math.min(cx, cy);
        const a = Math.random() * Math.PI * 2;
        const x = Math.floor(cx + Math.cos(a) * r), y = Math.floor(cy + Math.sin(a) * r);
        if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = '.';
      }
      
      for (let r = 0; r < Math.min(cx, cy); r += 0.8) {
        const x = Math.floor(cx + Math.cos(ang) * r), y = Math.floor(cy + Math.sin(ang) * r);
        if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = (r % 3 < 1) ? '|' : '*';
      }
      
      for (let t = ang - 0.8; t < ang; t += 0.08) {
        const x = Math.floor(cx + Math.cos(t) * (Math.min(cx, cy) - 1));
        const y = Math.floor(cy + Math.sin(t) * (Math.min(cx, cy) - 1));
        if (x >= 0 && x < w && y >= 0 && y < h) grid[y][x] = '+';
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
