export const rain = {
  name: 'rain',
  icon: 'material-symbols:rainy-light',
  label: 'rain',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const drops = [];
    const splashes = [];
    const intensity = w * 0.8;
    let t = 0;

    const step = () => {
      t++;

      // Spawn rain drops
      if (Math.random() < 0.9) {
        const count = Math.random() * 3 | 0;
        for (let i = 0; i < count; i++) {
          drops.push({
            x: Math.random() * w | 0,
            y: 0,
            speed: 2 + Math.random() * 2,
            len: 2 + Math.random() * 3 | 0
          });
        }
      }

      const grid = Array.from({ length: h }, () => Array(w).fill(' '));

      // Update and render drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.y += d.speed;

        if (d.y >= h) {
          splashes.push({ x: d.x, y: h - 1, age: 0 });
          drops.splice(i, 1);
          continue;
        }

        // Draw drop trail
        for (let j = 0; j < d.len; j++) {
          const y = (d.y - j) | 0;
          if (y >= 0 && y < h) {
            grid[y][d.x] = j === 0 ? '|' : j === 1 ? ':' : '.';
          }
        }
      }

      // Update and render splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.age++;

        if (s.age > 6) {
          splashes.splice(i, 1);
          continue;
        }

        const y = s.y;
        const patterns = [
          [{ dx: 0, chr: 'o' }],
          [{ dx: -1, chr: '-' }, { dx: 0, chr: 'O' }, { dx: 1, chr: '-' }],
          [{ dx: -2, chr: '.' }, { dx: -1, chr: '~' }, { dx: 1, chr: '~' }, { dx: 2, chr: '.' }],
          [{ dx: -2, chr: '.' }, { dx: 2, chr: '.' }],
          [{ dx: -3, chr: '.' }, { dx: 3, chr: '.' }],
          []
        ];

        const pattern = patterns[Math.min(s.age, patterns.length - 1)];
        for (const p of pattern) {
          const x = s.x + p.dx;
          if (x >= 0 && x < w && y >= 0 && y < h) {
            grid[y][x] = p.chr;
          }
        }
      }

      pre.textContent = grid.map(r => r.join('')).join('\n');
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

