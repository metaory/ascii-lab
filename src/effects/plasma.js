export const plasma = {
  name: 'plasma',
  icon: 'ic:round-terrain',
  label: 'plasma',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = ' .:-=+*#%@';
    let t = 0;
    
    const step = () => {
      t += 0.1;
      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const v = Math.sin(x * 0.14 + t) + Math.sin(y * 0.1 - t) + Math.sin((x + y) * 0.08 + Math.sin(t));
          const idx = Math.floor(((v + 3) / 6) * (chars.length - 1));
          out += chars[idx];
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
