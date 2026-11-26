const LENGTH = /^(?:0|-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|em|rem|vh|vw|vmin|vmax|%))$/i;
const COLOR = /^(?:#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})|(?:rgba?|hsla?)\([0-9.,%\s-]+\)|[a-z]{3,20}|var\(--[a-z0-9_-]{1,60}\))$/i;

/** Parts split on `sep` outside parentheses, empty parts dropped. */
function split(value: string, sep: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    const isSep = sep === ' ' ? /\s/.test(ch) : ch === sep;
    if (isSep && depth === 0) {
      parts.push(current);
      current = '';
    } else current += ch;
  }
  parts.push(current);
  return parts.map((p) => p.trim()).filter((p) => p !== '');
}

function layer(value: string): string | null {
  let inset = false;
  const lengths: string[] = [];
  let color: string | null = null;
  for (const token of split(value, ' ')) {
    const low = token.toLowerCase();
    if (low === 'inset' && !inset) inset = true;
    else if (LENGTH.test(token)) lengths.push(low);
    else if (color === null && COLOR.test(token) && low !== 'none') color = token.replace(/\s+/g, ' ');
    else return null;
  }
  if (lengths.length < 2 || lengths.length > 4) return null;
  const parts = inset ? ['inset', ...lengths] : lengths;
  if (color !== null) parts.push(color);
  return parts.join(' ');
}

/**
 * The Hero Studio's copy of the server's ShadowValue::clean() (same grammar),
 * so the preview shows what the forum will and a bad value is flagged at once.
 */
export default function cleanShadow(value: string): string | null {
  value = value.trim();
  if (value === '' || value.length > 300 || /[^a-z0-9#().,%\s_-]/i.test(value)) return null;
  if (value.toLowerCase() === 'none') return 'none';
  const layers = split(value, ',');
  if (layers.length > 4) return null;
  const out: string[] = [];
  for (const l of layers) {
    const c = layer(l);
    if (c === null) return null;
    out.push(c);
  }
  return out.join(', ');
}
