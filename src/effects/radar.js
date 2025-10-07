export const radar = {
  name: 'radar',
  icon: 'solar:radar-bold',
  label: 'radar',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cx = w / 2, cy = h / 2;
    let ang = 0;
    const intensity = new Float32Array(w * h);
    const idx = (x, y) => y * w + x;
    
    const step = () => {
      ang += 0.12;
      let grid = Array.from({ length: h }, () => Array(w).fill(' '));

      const R = (Math.min(cx, cy) - 1) * 2; // 2x size
      const noise = (x, y) => {
        const v = Math.sin(x * 12.9898 + y * 78.233 + ang * 3.1) * 43758.5453;
        return (v - Math.floor(v));
      };

      // fade existing intensity
      for (let i = 0; i < intensity.length; i++) intensity[i] *= 0.92;

      // random blips with noise-weighted probability and stronger presence
      for (let i = 0; i < 200; i++) {
        const r = Math.random() * R;
        const a = Math.random() * Math.PI * 2;
        const x = Math.floor(cx + Math.cos(a) * r), y = Math.floor(cy + Math.sin(a) * r);
        if (x >= 0 && x < w && y >= 0 && y < h && Math.random() < 0.55 + 0.4 * noise(x, y)) intensity[idx(x, y)] = Math.max(intensity[idx(x, y)], 0.9);
      }

      // sweep adds intensity along its path
      for (let r = 0; r < R; r += 0.5) {
        const x = Math.floor(cx + Math.cos(ang) * r), y = Math.floor(cy + Math.sin(ang) * r);
        if (x >= 0 && x < w && y >= 0 && y < h) intensity[idx(x, y)] = Math.max(intensity[idx(x, y)], (1 - r / R) * 1.0);
      }

      // outline circle edge briefly near the sweep angle
      for (let t = ang - 0.8; t < ang; t += 0.04) {
        const x = Math.floor(cx + Math.cos(t) * R);
        const y = Math.floor(cy + Math.sin(t) * R);
        if (x >= 0 && x < w && y >= 0 && y < h) intensity[idx(x, y)] = Math.max(intensity[idx(x, y)], 0.8);
      }
      
      // map intensity to characters
      const chars = ' .,:;-~=+*#%@';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const v = intensity[idx(x, y)];
          const ci = v <= 0 ? 0 : Math.min(chars.length - 1, (v * (chars.length - 1)) | 0);
          grid[y][x] = chars[ci];
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
