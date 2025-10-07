// tiny perf utils: reused buffers, joins, trig LUTs, and helpers

export const chars = ' .:-=+*#%@'.split('');

export function clampInt(n, min, max) {
  const x = n | 0;
  return x < min ? min : (x > max ? max : x);
}

export function makeSinLUT(size = 2048, scale = 1) {
  const lut = new Float32Array(size);
  const pi2 = Math.PI * 2;
  for (let i = 0; i < size; i++) {
    lut[i] = Math.sin((i / size) * pi2) * scale;
  }
  const mask = size - 1;
  const at = (i) => lut[i & mask];
  return { lut, at, size, mask };
}

export function makeDims(cols, rows, maxCols = 120, maxRows = 60) {
  return {
    cols: cols > maxCols ? maxCols : cols,
    rows: rows > maxRows ? maxRows : rows
  };
}

export function ensureArray(len, fill = 0, arr) {
  if (!arr || arr.length !== len) return new Array(len).fill(fill);
  return arr;
}

export function ensureTyped(len, ctor = Float32Array, buf) {
  if (!buf || buf.length !== len) return new ctor(len);
  return buf;
}

export function makeRowBuffers(w, h) {
  const rows = new Array(h);
  for (let y = 0; y < h; y++) rows[y] = new Array(w);
  return rows;
}

export function buildText(rows, lines) {
  const out = lines && lines.length === rows.length ? lines : new Array(rows.length);
  for (let y = 0; y < rows.length; y++) out[y] = rows[y].join('');
  return out.join('\n');
}

export function bitfloor(x) { return x | 0; }

export function makeTicker(fn) {
  let id = 0;
  const step = (t) => { fn(t); id = requestAnimationFrame(step); };
  const start = () => { if (!id) id = requestAnimationFrame(step); };
  const stop = () => { if (id) { cancelAnimationFrame(id); id = 0; } };
  return { start, stop };
}

export function visibilityPause(resume) {
  const onVis = () => { if (!document.hidden) resume(); };
  document.addEventListener('visibilitychange', onVis, { passive: true });
  return () => document.removeEventListener('visibilitychange', onVis);
}


