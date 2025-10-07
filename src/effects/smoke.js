export const smoke = {
  name: 'smoke',
  icon: 'mdi:weather-windy',
  label: 'smoke',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const field = new Float32Array(w * h);
    const next = new Float32Array(w * h);
    const chars = ' .,:;~=+*#%@';
    let t = 0;
    
    const sources = [
      { x: w * 0.25, power: 1.3 },
      { x: w * 0.75, power: 1.1 },
      { x: w * 0.5, power: 1.6 }
    ];

    const at = (x, y) => y * w + x;

    const step = () => {
      t++;
      
      // Spawn smoke particles
      for (const src of sources) {
        for (let s = 0; s < src.power * 6 | 0; s++) {
          const x = Math.max(0, Math.min(w - 1, (src.x + (Math.random() - 0.5) * 5) | 0));
          const y = h - 1 - (Math.random() * 2 | 0);
          field[at(x, y)] = Math.min(1.2, field[at(x, y)] + src.power * (0.8 + Math.random() * 0.4));
        }
      }

      // Simulate fluid dynamics
      const wind = Math.sin(t * 0.01) * 2 + Math.cos(t * 0.013) * 0.7;
      
      for (let y = 1; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const v = field[at(x, y)];
          if (v <= 0.01) continue;
          
          // Diffusion
          const l = x > 0 ? field[at(x - 1, y)] : 0;
          const r = x < w - 1 ? field[at(x + 1, y)] : 0;
          const u = field[at(x, y - 1)];
          const diffused = v * 0.82 + (l + r + u) * 0.06;
          
          // Advection with wind
          const drift = (wind + Math.sin(x * 0.12 + t * 0.025) * 0.4) | 0;
          const nx = Math.max(0, Math.min(w - 1, x + drift));
          next[at(nx, y - 1)] = Math.max(next[at(nx, y - 1)], diffused);
        }
      }

      // Render
      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = at(x, y);
          field[i] = next[i] * 0.98;
          next[i] = 0;
          
          const v = field[i];
          if (v <= 0.02) {
            out += ' ';
          } else {
            const ci = Math.min(chars.length - 1, Math.max(1, ((v ** 0.65) * (chars.length - 1)) | 0));
            out += chars[ci];
          }
        }
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
