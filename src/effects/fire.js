export const fire = {
  name: 'fire',
  icon: 'solar:fire-bold',
  label: 'fire',
  start(pre, colsRows) {
    const { cols: W, rows: H } = colsRows();
    const w = W, h = H;
    const size = w * h;
    const pal = " .,:;i1tfLCG08@".split('');
    const map = new Uint8Array(size);
    for (let x = 0; x < w; x++) map[(h - 1) * w + x] = pal.length - 1;
    
    const step = () => {
      for (let y = 0; y < h - 1; y++) {
        for (let x = 0; x < w; x++) {
          const src = (y + 1) * w + x;
          let v = map[src] - (Math.random() * 2 | 0);
          if (v < 0) v = 0;
          map[y * w + x] = v;
        }
      }
      let out = '', i = 0;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) out += pal[map[i++]] || ' ';
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
