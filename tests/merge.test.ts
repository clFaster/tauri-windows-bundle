import { describe, it, expect } from 'vitest';
import { jsonMergePatch } from '../src/utils/merge.js';

describe('jsonMergePatch', () => {
  it('replaces primitive values', () => {
    const target = { a: 1, b: 2 };
    const patch = { a: 3 };
    expect(jsonMergePatch(target, patch)).toEqual({ a: 3, b: 2 });
  });

  it('adds new keys', () => {
    const target = { a: 1 };
    const patch = { b: 2 };
    expect(jsonMergePatch(target, patch)).toEqual({ a: 1, b: 2 });
  });

  it('removes keys when value is null', () => {
    const target = { a: 1, b: 2 };
    const patch = { a: null };
    expect(jsonMergePatch(target, patch)).toEqual({ b: 2 });
  });

  it('recursively merges nested objects', () => {
    const target = { a: { b: 1, c: 2 } };
    const patch = { a: { b: 3 } };
    expect(jsonMergePatch(target, patch)).toEqual({ a: { b: 3, c: 2 } });
  });

  it('replaces arrays (does not merge them)', () => {
    const target = { a: [1, 2, 3] };
    const patch = { a: [4, 5] };
    expect(jsonMergePatch(target, patch)).toEqual({ a: [4, 5] });
  });

  it('replaces object with primitive', () => {
    const target = { a: { b: 1 } };
    const patch = { a: 'string' };
    expect(jsonMergePatch(target, patch)).toEqual({ a: 'string' });
  });

  it('replaces primitive with object', () => {
    const target = { a: 'string' };
    const patch = { a: { b: 1 } };
    expect(jsonMergePatch(target, patch)).toEqual({ a: { b: 1 } });
  });

  it('handles empty patch', () => {
    const target = { a: 1 };
    const patch = {};
    expect(jsonMergePatch(target, patch)).toEqual({ a: 1 });
  });

  it('handles non-object patch by returning patch', () => {
    const target = { a: 1 };
    expect(jsonMergePatch(target, 'string')).toBe('string');
    expect(jsonMergePatch(target, 42)).toBe(42);
    expect(jsonMergePatch(target, null)).toBe(null);
  });

  it('does not mutate original target', () => {
    const target = { a: { b: 1 } };
    const patch = { a: { b: 2 } };
    jsonMergePatch(target, patch);
    expect(target).toEqual({ a: { b: 1 } });
  });

  // RFC 7396 example from specification
  it('handles RFC 7396 example', () => {
    const target = {
      title: 'Goodbye!',
      author: { givenName: 'John', familyName: 'Doe' },
      tags: ['example', 'sample'],
      content: 'This will be unchanged',
    };
    const patch = {
      title: 'Hello!',
      phoneNumber: '+01-123-456-7890',
      author: { familyName: null },
      tags: ['example'],
    };
    expect(jsonMergePatch(target, patch)).toEqual({
      title: 'Hello!',
      author: { givenName: 'John' },
      tags: ['example'],
      content: 'This will be unchanged',
      phoneNumber: '+01-123-456-7890',
    });
  });
});
