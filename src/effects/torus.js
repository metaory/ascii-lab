export const torus = {
  name: 'torus',
  icon: 'solar:planet-bold',
  label: 'torus',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    let a = 0, b = 0;
    
    const step = () => {
      a += 0.07; 
      b += 0.03;
      const out = Array.from({ length: h }, () => Array(w).fill(' '));
      const z = Array(w * h).fill(0);
      const chars = ".,-~:;=!*#$@";
      
      for (let theta = 0; theta < Math.PI * 2; theta += 0.05) {
        for (let phi = 0; phi < Math.PI * 2; phi += 0.015) {
          const ct = Math.cos(theta), st = Math.sin(theta);
          const cp = Math.cos(phi), sp = Math.sin(phi);
          const h1 = ct + 2;
          const D = 1 / (sp * h1 * Math.sin(a) + st * Math.cos(a) + 5);
          const t = sp * h1 * Math.cos(a) - st * Math.sin(a);
          const x = Math.floor((w / 2) + 2 * D * (cp * h1 * Math.cos(b) - t * Math.sin(b)) * ((w / 14) * 4));
          const y = Math.floor((h / 2) + 1 * D * (cp * h1 * Math.sin(b) + t * Math.cos(b)) * ((h / 9) * 4));
          const o = Math.floor((cp * h1 * Math.sin(a) + st * Math.cos(a)) * 8);
          const idx = (y | 0) * w + (x | 0);
          if (x >= 0 && x < w && y >= 0 && y < h && D > z[idx]) {
            z[idx] = D;
            out[y][x] = chars[Math.max(0, Math.min(chars.length - 1, o + 5))];
          }
        }
      }
      pre.textContent = out.map(r => r.join('')).join('\n');
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
