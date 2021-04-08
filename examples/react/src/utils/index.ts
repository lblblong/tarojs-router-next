export function sleep(ms = 1000) {
  return new Promise((ok) => {
    setTimeout(ok, ms)
  })
}

