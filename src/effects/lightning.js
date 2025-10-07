export const lightning = {
  name: 'lightning',
  icon: 'mingcute:lightning-fill',
  label: 'lightning',
  start(pre, colsRows) {
    const { cols: w, rows: h } = colsRows();
    const chars = ' .:;~=+*#%@';
    let t = 0;
    let bolts = [];
    let lastStrike = 0;

    const createBolt = (startX, startY, endX, endY, intensity = 1.0) => {
      const segments = [];
      const steps = Math.max(15, Math.floor(Math.hypot(endX - startX, endY - startY) / 1.5));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = startX + (endX - startX) * t;
        const y = startY + (endY - startY) * t;

        // Add more aggressive branching
        const branchChance = 0.5;
        if (Math.random() < branchChance && i > 3 && i < steps - 3) {
          const branchLength = 8 + Math.random() * 15;
          const branchAngle = (Math.random() - 0.5) * Math.PI;
          const branchX = x + Math.cos(branchAngle) * branchLength;
          const branchY = y + Math.sin(branchAngle) * branchLength;

          if (branchX >= 0 && branchX < w && branchY >= 0 && branchY < h) {
            segments.push({ x: branchX, y: branchY, intensity: intensity * 0.8, life: 12 });
          }
        }

        segments.push({ x, y, intensity: intensity, life: 18 });
      }

      return segments;
    };

    const step = () => {
      t += 1;

      // Create new lightning strikes - more frequent and dramatic
      if (t - lastStrike > 15 + Math.random() * 25) {
        lastStrike = t;

        // Primary strike from top to bottom
        const startX = Math.random() * w;
        const endX = startX + (Math.random() - 0.5) * w * 0.4;
        const segments = createBolt(startX, 0, endX, h - 1, 1.2);
        bolts.push(...segments);

        // Create multiple simultaneous strikes
        const strikeCount = Math.random() < 0.3 ? 3 : (Math.random() < 0.7 ? 2 : 1);

        for (let i = 1; i < strikeCount; i++) {
          const secondX = Math.random() * w;
          const secondEndX = secondX + (Math.random() - 0.5) * w * 0.3;
          const secondSegments = createBolt(secondX, 0, secondEndX, h - 1, 0.9);
          bolts.push(...secondSegments);
        }

        // Occasionally create horizontal lightning
        if (Math.random() < 0.2) {
          const hStartY = Math.random() * h * 0.3;
          const hEndY = hStartY + (Math.random() - 0.5) * h * 0.2;
          const hSegments = createBolt(0, hStartY, w - 1, hEndY, 0.8);
          bolts.push(...hSegments);
        }
      }

      // Update bolt segments
      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i];
        bolt.life--;
        bolt.intensity *= 0.92;

        if (bolt.life <= 0 || bolt.intensity < 0.01) {
          bolts.splice(i, 1);
        }
      }

      // Render lightning
      const grid = Array.from({ length: h }, () => Array(w).fill(' '));

      for (const bolt of bolts) {
        const x = Math.floor(bolt.x);
        const y = Math.floor(bolt.y);

        if (x >= 0 && x < w && y >= 0 && y < h) {
          const intensity = bolt.intensity;
          const ci = Math.min(chars.length - 1, Math.max(1, Math.floor(intensity * (chars.length - 1))));
          grid[y][x] = chars[ci];

          // Enhanced glow effect for more dramatic lightning
          for (let dy = -2; dy <= 2; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < w && ny >= 0 && ny < h && (dx !== 0 || dy !== 0)) {
                const distance = Math.hypot(dx, dy);
                const glowIntensity = intensity * (0.5 - distance * 0.1);
                if (glowIntensity > 0.1) {
                  const glowCi = Math.min(chars.length - 1, Math.max(1, Math.floor(glowIntensity * (chars.length - 1))));
                  if (grid[ny][nx] === ' ' || glowIntensity > 0.3) {
                    grid[ny][nx] = chars[glowCi];
                  }
                }
              }
            }
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
