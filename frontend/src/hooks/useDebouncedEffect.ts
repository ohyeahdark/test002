import { useEffect } from 'react';

/**
 * Hook gọi một effect callback sau khi các dependencies dừng thay đổi trong khoảng thời gian `delay`.
 * @param effect - Hàm callback cần gọi (nên là async hoặc không trả về gì)
 * @param deps - Mảng dependency (giống như useEffect)
 * @param delay - Thời gian debounce (ms), mặc định 500ms
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList,
  delay: number = 500
) {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => clearTimeout(handler);
  }, [...deps, delay]); // delay cũng là dependency
}
