export const matrix = {
  name: 'matrix',
  icon: 'dinkie-icons:display-dot-matrix-small',
  label: 'matrix',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cols = new Array(w).fill(0);
    const chars = '　abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-'.split('');
    
    const step = () => {
      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const drop = cols[x];
          if (y === drop) out += chars[Math.random() * chars.length | 0];
          else if (y < drop && Math.random() > 0.85) out += chars[Math.random() * chars.length | 0];
          else out += ' ';
        }
        out += '\n';
      }
      for (let i = 0; i < w; i++) {
        if (Math.random() > 0.98) cols[i] = 0;
        else cols[i] = (cols[i] + (1 + (Math.random() * 3 | 0))) % (h + (Math.random() * 10 | 0));
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
