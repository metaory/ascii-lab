import { makeRowBuffers, buildText, ensureArray } from '../util.js'

export const matrix = {
  name: 'matrix',
  icon: 'dinkie-icons:display-dot-matrix-small',
  label: 'matrix',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    let drops = ensureArray(w, 0);
    let trail = ensureArray(w, 0);
    const chars = '　abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=-'.split('');
    const rows = makeRowBuffers(w, h);
    let lines = new Array(h);

    const step = () => {
      for (let y = 0; y < h; y++) {
        const row = rows[y];
        for (let x = 0; x < w; x++) {
          const head = drops[x];
          const dt = (head - y + h) % h;
          row[x] = y === head
            ? '█'
            : (dt > 0 && dt <= trail[x])
              ? chars[Math.random() * chars.length | 0]
              : ' ';
        }
      }
      const out = buildText(rows, lines);
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
