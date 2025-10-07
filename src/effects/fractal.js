export const fractal = {
  name: 'fractal',
  icon: 'icon-park-twotone:refraction',
  label: 'fractal',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = ' .:;~=+*#%@';
    let t = 0;

    const step = () => {
      t += 0.05;

      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // Normalize coordinates to [-2, 2] range
          const cx = (x / w) * 4 - 2;
          const cy = (y / h) * 4 - 2;

          // Julia set fractal with animated parameters
          let zx = cx;
          let zy = cy;
          let iterations = 0;
          const maxIterations = 50;

          // Animated Julia set parameters
          const juliaX = Math.sin(t * 0.3) * 0.7;
          const juliaY = Math.cos(t * 0.2) * 0.5;

          while (iterations < maxIterations && zx * zx + zy * zy < 4) {
            const tmp = zx * zx - zy * zy + juliaX;
            zy = 2 * zx * zy + juliaY;
            zx = tmp;
            iterations++;
          }

          // Map iterations to character
          const intensity = iterations / maxIterations;
          const ci = Math.min(chars.length - 1, Math.max(0, Math.floor(intensity * (chars.length - 1))));
          out += chars[ci];
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
