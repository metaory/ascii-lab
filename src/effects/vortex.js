export const vortex = {
  name: 'vortex',
  icon: 'streamline-plump:spiral-shape-solid',
  label: 'vortex',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cx = (w - 1) / 2, cy = (h - 1) / 2;
    let t = 0;

    const step = () => {
      t += 0.06;
      const grid = Array.from({ length: h }, () => Array(w).fill(' '));
      const chars = ' .:-=+*#%@';
      const aspect = w / Math.max(1, h);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // normalize to avoid horizontal stretching and remove seam by adding small wrap term
          const dx = (x - cx) / aspect;
          const dy = (y - cy);
          const r = Math.hypot(dx, dy) + 0.001;
          const wrap = ((x / w) * 2 * Math.PI);
          const a = Math.atan2(dy, dx) + t + (1 / r) * 1.1 + wrap * 0.0005;
          const s = Math.sin(a * 2.0 + r * 0.45) * 0.5 + 0.5;
          const idx = Math.max(0, Math.min(chars.length - 1, (s * (chars.length - 1)) | 0));
          grid[y][x] = chars[idx];
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


