/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { useDebounce, useToggle, usePagination } from '@/hooks/index';

describe('useDebounce', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'initial' },
    });
    rerender({ value: 'updated' });
    expect(result.current).toBe('initial');
    act(() => { jest.advanceTimersByTime(300); });
    expect(result.current).toBe('updated');
  });
});

describe('useToggle', () => {
  it('starts with initial value false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('starts with initial value true', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('toggles state on call', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[1]());
    expect(result.current[0]).toBe(true);
    act(() => result.current[1]());
    expect(result.current[0]).toBe(false);
  });

  it('sets state directly', () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current[2](true));
    expect(result.current[0]).toBe(true);
  });
});

describe('usePagination', () => {
  const items = Array.from({ length: 25 }, (_, i) => `item-${i + 1}`);

  it('returns first page by default', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.page).toBe(1);
    expect(result.current.paginated).toHaveLength(10);
    expect(result.current.paginated[0]).toBe('item-1');
  });

  it('calculates total pages correctly', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    expect(result.current.totalPages).toBe(3);
  });

  it('navigates to next page', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.next());
    expect(result.current.page).toBe(2);
    expect(result.current.paginated[0]).toBe('item-11');
  });

  it('navigates to previous page', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.next());
    act(() => result.current.prev());
    expect(result.current.page).toBe(1);
  });

  it('does not go below page 1', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.prev());
    expect(result.current.page).toBe(1);
    expect(result.current.isFirst).toBe(true);
  });

  it('does not exceed total pages', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.goTo(999));
    expect(result.current.page).toBe(3);
    expect(result.current.isLast).toBe(true);
  });

  it('returns correct last page items', () => {
    const { result } = renderHook(() => usePagination(items, 10));
    act(() => result.current.goTo(3));
    expect(result.current.paginated).toHaveLength(5); // 25 - 20 = 5 remaining
  });
});
