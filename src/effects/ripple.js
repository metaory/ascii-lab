export const ripple = {
  name: 'ripple',
  icon: 'mdi:water-circle',
  label: 'ripple',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = ' .:-=+*#%@';
    const aspect = w / Math.max(1, h);
    let t = 0;
    const sources = [];
    const maxSources = 5;

    const spawnSource = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      birth: t,
      freq: 0.3 + Math.random() * 0.4,
      amp: 0.8 + Math.random() * 0.4,
      decay: 0.015 + Math.random() * 0.01
    });

    // Initialize sources
    for (let i = 0; i < 3; i++) sources.push(spawnSource());

    const step = () => {
      t += 0.1;

      // Spawn new sources occasionally
      if (Math.random() < 0.015 && sources.length < maxSources) {
        sources.push(spawnSource());
      }

      // Remove old sources
      for (let i = sources.length - 1; i >= 0; i--) {
        const age = t - sources[i].birth;
        if (age > 80) sources.splice(i, 1);
      }

      let out = '';
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let sum = 0;

          // Sum all ripple sources
          for (const src of sources) {
            const dx = (x - src.x) / aspect;
            const dy = y - src.y;
            const dist = Math.hypot(dx, dy);
            const age = t - src.birth;
            const phase = dist * src.freq - age * 0.15;
            const envelope = Math.exp(-dist * src.decay) * Math.max(0, 1 - age * 0.012);
            sum += Math.sin(phase) * envelope * src.amp;
          }

          // Map to character
          const intensity = (sum + 1) * 0.5;
          const idx = Math.max(0, Math.min(chars.length - 1, Math.floor(intensity * chars.length)));
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

