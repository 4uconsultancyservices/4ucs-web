import { cn, fmt, currency, formatDate, formatRelative, truncate } from '@/lib/utils';

describe('cn (className merger)', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });
  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
  it('deduplicates tailwind classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
  it('handles undefined and null', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });
});

describe('fmt (number formatter)', () => {
  it('formats billions', () => expect(fmt(1_500_000_000)).toBe('1.5B'));
  it('formats millions', () => expect(fmt(2_400_000)).toBe('2.4M'));
  it('formats thousands', () => expect(fmt(460_000)).toBe('460K'));
  it('formats small numbers', () => expect(fmt(42)).toBe('42'));
  it('respects decimals param', () => expect(fmt(1_200, 1)).toBe('1.2K'));
});

describe('currency formatter', () => {
  it('formats USD correctly', () => expect(currency(8500)).toBe('$8,500'));
  it('formats large values', () => expect(currency(460000)).toBe('$460,000'));
  it('handles zero', () => expect(currency(0)).toBe('$0'));
});

describe('formatDate', () => {
  it('returns a readable date string', () => {
    const result = formatDate('2026-05-09');
    expect(result).toMatch(/May/);
    expect(result).toMatch(/2026/);
  });
});

describe('formatRelative', () => {
  it('returns "just now" for very recent timestamps', () => {
    expect(formatRelative(new Date().toISOString())).toBe('just now');
  });
  it('returns minutes ago', () => {
    const d = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    expect(formatRelative(d)).toBe('5m ago');
  });
  it('returns hours ago', () => {
    const d = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(formatRelative(d)).toBe('3h ago');
  });
  it('returns days ago', () => {
    const d = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
    expect(formatRelative(d)).toBe('2d ago');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 8)).toBe('Hello W…');
  });
  it('does not truncate short strings', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
  it('handles exact length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });
});
