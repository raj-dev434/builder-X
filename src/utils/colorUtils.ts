export interface HSV {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a: number; // 0-1
}

export interface RGB {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(
    hex
  );
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: result[4] ? parseInt(result[4], 16) / 255 : 1,
      }
    : null;
};

export const rgbToHex = ({ r, g, b, a }: RGB): string => {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const alpha =
    a !== undefined && a !== 1
      ? Math.round(a * 255)
          .toString(16)
          .padStart(2, "0")
      : "";

  return `#${toHex(r)}${toHex(g)}${toHex(b)}${alpha}`;
};

export const rgbToHsv = ({ r, g, b, a }: RGB): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const v = max;

  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100, a };
};

export const hsvToRgb = ({ h, s, v, a }: HSV): RGB => {
  let r = 0,
    g = 0,
    b = 0;

  const i = Math.floor(h / 60);
  const f = h / 60 - i;
  const p = (v / 100) * (1 - s / 100);
  const q = (v / 100) * (1 - (s / 100) * f);
  const t = (v / 100) * (1 - (s / 100) * (1 - f));
  const val = v / 100;

  switch (i % 6) {
    case 0:
      r = val;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = val;
      b = p;
      break;
    case 2:
      r = p;
      g = val;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = val;
      break;
    case 4:
      r = t;
      g = p;
      b = val;
      break;
    case 5:
      r = val;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a,
  };
};
