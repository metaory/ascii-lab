import { makeRowBuffers, buildText } from '../util.js'

export const plasma = {
  name: 'plasma',
  icon: 'ic:round-terrain',
  label: 'plasma',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = ' .:-=+*#%@';
    let t = 0;
    const rows = makeRowBuffers(w, h);
    let lines = new Array(h);
    
    const step = () => {
      t += 0.1;
      for (let y = 0; y < h; y++) {
        const row = rows[y];
        for (let x = 0; x < w; x++) {
          const v = Math.sin(x * 0.14 + t) + Math.sin(y * 0.1 - t) + Math.sin((x + y) * 0.08 + Math.sin(t));
          const idx = Math.floor(((v + 3) / 6) * (chars.length - 1));
          row[x] = chars[idx];
        }
      }
      pre.textContent = buildText(rows, lines);
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
