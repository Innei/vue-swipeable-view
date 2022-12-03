export const throttle = (fn: Function, wait: number) => {
  let lastTime = 0
  return function (...args: any) {
    const now = Date.now()
    if (now - lastTime > wait) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}
