export const debounce = <A extends unknown[]>(fn: (...args: A) => void, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};
