export const tunnel = {
  name: 'tunnel',
  icon: 'mdi:tunnel-outline',
  label: 'tunnel',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const cx = w / 2, cy = h / 2;
    const aspect = w / Math.max(1, h);
    const chars = ' .:-=+*#%@';
    let t = 0;

    const step = () => {
      t += 0.1;
      let out = '';
      
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = (x - cx) / aspect;
          const dy = y - cy;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);
          
          // Create tunnel depth
          const depth = dist > 0.01 ? 1 / dist : 100;
          const z = depth * 20 + t;
          
          // Circular patterns moving toward viewer
          const ring = Math.sin(z * 0.5) * 0.5 + 0.5;
          
          // Rotating stripes
          const stripes = Math.sin(angle * 8 + t * 2) * 0.5 + 0.5;
          
          // Combine patterns with depth falloff
          const intensity = ring * 0.7 + stripes * 0.3;
          const fade = Math.min(1, dist / Math.max(w, h) * 4);
          const final = intensity * (1 - fade);
          
          const idx = Math.max(0, Math.min(chars.length - 1, Math.floor(final * chars.length)));
          out += chars[idx];
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

