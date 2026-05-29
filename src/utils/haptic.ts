export function vibrateNode() {
  if ('vibrate' in navigator) navigator.vibrate(10)
}

export function vibrateDestination() {
  if ('vibrate' in navigator) navigator.vibrate(100)
}

export function vibrateGameOver() {
  if ('vibrate' in navigator) navigator.vibrate([50, 30, 50])
}
