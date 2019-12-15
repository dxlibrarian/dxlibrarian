export function deepFreeze(state: any): void {
  for (let key in state) {
    if (state.hasOwnProperty(key)) {
      const subState = state[key];
      if (subState === undefined) {
        state[key] = null;
      }
      if (subState === Object(subState)) {
        deepFreeze(subState);
      }
    }
  }
  Object.freeze(state);
}
