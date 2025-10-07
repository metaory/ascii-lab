export const bubbles = {
  name: 'bubbles',
  icon: 'mdi:chart-bubble',
  label: 'bubbles',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const n = Math.floor(w * 0.2) + 10;
    const parts = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: h - 1 - Math.random() * 3,
      r: 1 + Math.random() * 3,
      vy: 0.2 + Math.random() * 0.6,
    }));

    const step = () => {
      const grid = Array.from({ length: h }, () => Array(w).fill(' '));
      for (const p of parts) {
        p.y -= p.vy;
        p.x += Math.sin((performance.now() * 0.001) + p.y * 0.3) * 0.2;
        if (p.y < 0) {
          p.y = h - 1;
          p.x = Math.random() * w;
          p.r = 1 + Math.random() * 3;
          p.vy = 0.2 + Math.random() * 0.6;
        }
        const R = p.r;
        for (let yy = -R; yy <= R; yy++) {
          for (let xx = -R; xx <= R; xx++) {
            const xi = (p.x + xx) | 0, yi = (p.y + yy) | 0;
            if (xi >= 0 && xi < w && yi >= 0 && yi < h) {
              const d = Math.hypot(xx, yy);
              if (d <= R) grid[yi][xi] = d < R - 0.8 ? 'o' : 'O';
            }
          }
        }
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


