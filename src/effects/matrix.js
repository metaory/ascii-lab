export const matrix = {
  name: 'matrix',
  icon: 'dinkie-icons:display-dot-matrix-small',
  label: 'matrix',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const drops = new Array(w).fill(0);
    const trail = new Array(w).fill(0);
    const chars = '　abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-'.split('');
    
    const step = () => {
      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const head = drops[x];
          const dt = (head - y + h) % h; // distance from head
          if (y === head) {
            out += '█';
          } else if (dt > 0 && dt <= trail[x]) {
            out += chars[Math.random() * chars.length | 0];
          } else {
            out += ' ';
          }
        }
        if (y < h - 1) out += '\n';
      }
      for (let i = 0; i < w; i++) {
        if (Math.random() > 0.985) { drops[i] = 0; trail[i] = 0; }
        else {
          const speed = 1 + (Math.random() * 2 | 0);
          drops[i] = (drops[i] + speed) % h;
          trail[i] = Math.min(h, Math.max(2, trail[i] + (Math.random() > 0.7 ? 1 : -1)));
        }
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
