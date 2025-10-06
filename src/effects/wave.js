export const wave = {
  name: 'wave',
  icon: 'mdi:heat-wave',
  label: 'wave',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = '~`-._/\\|—=+*oO0@';
    let t = 0;
    
    const step = () => {
      t += 0.25;
      let out = '';
      for (let y = 0; y < h; y++) {
        const amp = 3 + Math.sin(y * 0.25 + t) * 3;
        const shift = Math.floor((Math.sin(t * 1.4 + y * 0.9) + 1) * amp);
        for (let x = 0; x < w; x++) {
          const cx = (x + shift) % chars.length;
          out += chars[cx | 0];
        }
        out += '\n';
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
