export const debounce = (fn: Function, wait = 300) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any) {
    const context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(context, args);
    }, wait);
  };
};
