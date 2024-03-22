export function createHooks(callback) {
  const useState = initState => {
    let state = initState;
    const setState = newState => {
      if (state === newState) return;
      callback();
      state = newState;
    };
    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {};

  return { useState, useMemo, resetContext };
}
