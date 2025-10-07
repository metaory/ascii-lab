export const life = {
  name: 'life',
  icon: 'solar:gameboy-bold',
  label: 'life',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    let grid = Array.from({ length: h }, () => Array.from({ length: w }, () => Math.random() > 0.82 ? 1 : 0));

    const count = (y, x) => {
      let c = 0;
      for (let yy = -1; yy <= 1; yy++) {
        for (let xx = -1; xx <= 1; xx++) {
          if (yy === 0 && xx === 0) continue;
          const yi = (y + yy + h) % h;
          const xi = (x + xx + w) % w;
          c += grid[yi][xi];
        }
      }
      return c;
    };

    const step = () => {
      const next = Array.from({ length: h }, () => Array(w).fill(0));
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const n = count(y, x);
          const alive = grid[y][x] === 1;
          next[y][x] = (alive && (n === 2 || n === 3)) || (!alive && n === 3) ? 1 : 0;
        }
      }
      grid = next;
      pre.textContent = grid.map(r => r.map(v => v ? '█' : ' ').join('')).join('\n');
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


