import { useEffect, useState } from 'react';

/**
 * Hook dùng để debounce một giá trị (ví dụ: keyword tìm kiếm).
 * @param value - Giá trị cần debounce (string, number, object...)
 * @param delay - Thời gian chờ debounce (ms), mặc định: 500ms
 * @returns Giá trị đã debounce
 */
export function useDebounce<T>(value: T, delay = 1000): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
