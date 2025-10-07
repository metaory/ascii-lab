export const glitch = {
  name: 'glitch',
  icon: 'pixelarticons:downasaur',
  label: 'glitch',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = '█▓▒░<>[]{}()/\\|~^*=-+_:;.,';
    let buf = Array.from({ length: h }, () => chars[Math.random() * chars.length | 0].repeat(w));
    
    const step = () => {
      for (let y = 0; y < h; y++) {
        if (Math.random() > 0.6) buf[y] = Array.from({ length: w }, () => chars[Math.random() * chars.length | 0]).join('');
        else if (Math.random() > 0.85) {
          const off = (Math.random() * 8 | 0) - 4;
          buf[y] = buf[y].slice(Math.max(0, off)) + ' '.repeat(Math.max(0, -off));
        }
      }
      let out = '';
      for (let y = 0; y < h; y++) {
        if (Math.random() > 0.96) out += buf[h - 1 - y];
        else out += buf[y];
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
