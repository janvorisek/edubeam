export const throttle = (fn: Function, wait = 300) => {
  let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
  return function (this: any) {
    const context = this,
      // eslint-disable-next-line prefer-rest-params
      args = arguments;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(
        () => {
          if (Date.now() - lastTime >= wait) {
            fn.apply(context, args);
            lastTime = Date.now();
          }
        },
        Math.max(wait - (Date.now() - lastTime), 0)
      );
    }
  };
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const checkNumber = (e: KeyboardEvent) => {
  if (e.key === "Escape") if ("activeElement" in document) (document.activeElement as HTMLElement).blur();

  const isNumber = !isNaN(e.key as unknown as number);

  const isActionKey =
    (e.ctrlKey && e.key === "a") ||
    e.key === "Escape" ||
    e.key === "Delete" ||
    e.key === "Backspace" ||
    e.key === "Enter" ||
    e.key === "Tab" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft" ||
    e.key === "End" ||
    e.key === "Home" ||
    e.key === "e" ||
    e.key === "-";

  const isComma = e.key === "," || e.key === ".";

  if (isNumber || isActionKey || isComma) return;

  e.stopPropagation();
  e.preventDefault();
};
