export const wave = {
  name: 'wave',
  icon: 'mdi:heat-wave',
  label: 'wave',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = '~`-._/\\|=+*oO0@';
    let t = 0;
    
    const step = () => {
      t += 0.25;
      let out = '';
      for (let y = 0; y < h; y++) {
        const amp = 2 + Math.sin(y * 0.22 + t * 0.7) * 3;
        const phase = Math.sin(t * 1.2 + y * 0.8);
        const shift = Math.floor((phase + 1) * amp);
        for (let x = 0; x < w; x++) {
          const k = (x + shift) % chars.length;
          const p = (Math.sin((x + y * 0.3 + t) * 0.1) + 1) * 0.5;
          const idx = (k * p) | 0;
          out += chars[idx];
        }
        if (y < h - 1) out += '\n';
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
