export function createHooks(callback) {
  let states = [];
  let statesIndex = 0;
  let memoizedValues = [];
  let memoIndex = 0;

  const useState = initState => {
    const currentIndex = statesIndex;
    states[currentIndex] = states[currentIndex] ?? initState;
    const setState = newState => {
      // 새로운 상태와 현재 상태가 다를 경우에만 상태 업데이트 및 render 재호출
      if (states[currentIndex] !== newState) {
        states[currentIndex] = newState;
        resetContext();
        callback();
      }
    };
    statesIndex++;
    return [states[currentIndex], setState];
  };

  const useMemo = (fn, deps) => {
    const currentMemo = memoizedValues[memoIndex];
    const hasChanged = currentMemo
      ? deps.some((dep, index) => dep !== currentMemo.deps[index])
      : true;
    if (hasChanged) {
      const newValue = fn();
      memoizedValues[memoIndex] = { value: newValue, deps };
      memoIndex++;
      return newValue;
    } else {
      memoIndex++;
      return currentMemo.value;
    }
  };

  const resetContext = () => {
    statesIndex = 0;
    memoIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
