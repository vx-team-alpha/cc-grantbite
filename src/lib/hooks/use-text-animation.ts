import { writable } from "svelte/store"

export function useTextAnimation(strings: string[], delay = 2000) {
  const currentText = writable("")
  const isRevealing = writable(false)
  const isDeleting = writable(false)

  let currentIndex = 0
  let charIndex = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  function reveal() {
    if (charIndex < strings[currentIndex].length) {
      isRevealing.set(true)
      isDeleting.set(false)

      currentText.update((text) => text + strings[currentIndex][charIndex])
      charIndex++

      timeoutId = setTimeout(reveal, 100)
    } else {
      isRevealing.set(false)
      timeoutId = setTimeout(deleteText, delay)
    }
  }

  function deleteText() {
    if (charIndex > 0) {
      isDeleting.set(true)
      isRevealing.set(false)

      currentText.update((text) => text.slice(0, -1))
      charIndex--

      timeoutId = setTimeout(deleteText, 50)
    } else {
      isDeleting.set(false)
      currentIndex = (currentIndex + 1) % strings.length
      timeoutId = setTimeout(reveal, 300)
    }
  }

  function start() {
    if (strings.length > 0) {
      currentIndex = 0
      charIndex = 0
      currentText.set("")
      reveal()
    }
  }

  function stop() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    isRevealing.set(false)
    isDeleting.set(false)
  }

  function reset() {
    stop()
    currentText.set("")
    currentIndex = 0
    charIndex = 0
  }

  start()

  return {
    currentText: { subscribe: currentText.subscribe },
    isRevealing: { subscribe: isRevealing.subscribe },
    isDeleting: { subscribe: isDeleting.subscribe },
    start,
    stop,
    reset,
  }
}
